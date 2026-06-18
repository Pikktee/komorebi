import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Stelle } from '../types';
import { PROGRAMM_LABEL } from '../lib/labels';

interface StellenKarteProps {
  stellen: Stelle[];
  height?: string | number;
}

export function StellenKarte({ stellen, height = 500 }: StellenKarteProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();

  // Group stellen by coordinates to prevent overlapping markers
  const groupedStellen = stellen.reduce<
    Record<string, { lat: number; lon: number; label: string; items: Stelle[] }>
  >((acc, s) => {
    if (s.geo_lat === null || s.geo_lon === null) return acc;
    // Round to 4 decimal places to catch identical locations
    const key = `${s.geo_lat.toFixed(4)},${s.geo_lon.toFixed(4)}`;
    if (!acc[key]) {
      acc[key] = {
        lat: s.geo_lat,
        lon: s.geo_lon,
        label: s.geo_label || s.land,
        items: [],
      };
    }
    acc[key].items.push(s);
    return acc;
  }, {});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of the world
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      worldCopyJump: true,
    });

    // CartoDB Voyager tiles (clean, beautiful, permitted usage)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create custom icons and markers
    Object.entries(groupedStellen).forEach(([_, group]) => {
      const count = group.items.length;
      if (count === 0) return;

      const hasESC = group.items.some((item) => item.programm === 'ESC');
      const hasFree = group.items.some((item) => item.kost_unterkunft_frei);
      
      // Select marker color: ESC/funded is forest green, otherwise orange/terra
      const color = hasESC ? '#2b8a3e' : hasFree ? '#3b5bdb' : '#e67700'; 
      
      const icon = L.divIcon({
        html: `<div class="map-marker-pin" style="
          background-color: ${color};
          color: white;
          width: ${count > 1 ? '32px' : '22px'};
          height: ${count > 1 ? '32px' : '22px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: ${count > 1 ? '13px' : '11px'};
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.15s ease-out;
        ">
          ${count > 1 ? count : ''}
        </div>`,
        className: 'custom-map-marker-container',
        iconSize: count > 1 ? [32, 32] : [22, 22],
        iconAnchor: count > 1 ? [16, 16] : [11, 11],
      });

      // Construct Popup Content
      const listHtml = group.items
        .map((s) => {
          const detailLabels: string[] = [];
          if (s.programm && s.programm !== 'keins') detailLabels.push(PROGRAMM_LABEL[s.programm]);
          if (s.kost_unterkunft_frei) detailLabels.push('Kost & Logis frei');
          if (s.kostenpflichtig) detailLabels.push('Gebührenpflichtig');

          return `
            <div class="popup-stelle-item" style="padding: 8px 0; border-bottom: 1px solid var(--nz-line); margin-bottom: 4px;">
              <div style="font-weight: 600; font-size: 13px; line-height: 1.25; color: var(--nz-ink);">
                ${s.titel}
              </div>
              <div style="font-size: 11px; color: var(--nz-ink-dimmed); margin-top: 2px;">
                ${s.organisation}
              </div>
              <div style="margin-top: 4px; display: flex; gap: 4px; flex-wrap: wrap;">
                ${detailLabels.map((lbl) => `<span class="popup-badge" style="font-size: 9px; padding: 2px 6px; background-color: var(--nz-line); border-radius: 4px; color: var(--nz-ink);">${lbl}</span>`).join('')}
              </div>
              <div style="margin-top: 8px; text-align: right;">
                <button class="nz-popup-link popup-action-btn" data-id="${s.id}" style="
                  background: none;
                  border: 1px solid var(--mantine-color-wald-6);
                  color: var(--mantine-color-wald-8);
                  padding: 3px 8px;
                  border-radius: 4px;
                  font-size: 11px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background-color 0.15s;
                ">
                  Details ansehen &rarr;
                </button>
              </div>
            </div>
          `;
        })
        .join('');

      const popupHtml = `
        <div style="max-height: 240px; overflow-y: auto; padding-right: 4px; font-family: sans-serif; min-width: 200px;">
          <div style="font-weight: bold; border-bottom: 2px solid var(--nz-line); padding-bottom: 6px; margin-bottom: 8px; font-size: 14px; color: var(--mantine-color-wald-9);">
            ${group.label}
          </div>
          ${listHtml}
        </div>
      `;

      const marker = L.marker([group.lat, group.lon], { icon })
        .bindPopup(popupHtml, { maxWidth: 280, minWidth: 220 })
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Adjust zoom if multiple markers exist
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      // Only fit bounds if there are markers far apart
      const bounds = group.getBounds();
      if (bounds.isValid() && stellen.length > 0) {
        // If there's only 1 coordinate group, center on it and set standard zoom
        const uniqueCoords = Object.keys(groupedStellen).length;
        if (uniqueCoords === 1) {
          const firstGroup = Object.values(groupedStellen)[0];
          map.setView([firstGroup.lat, firstGroup.lon], 5);
        } else {
          // Fit bounds with padding
          map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
        }
      }
    }
  }, [stellen, groupedStellen]);

  // Intercept click events inside Leaflet Popup to use React Router navigation
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handlePopupClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkButton = target.closest('.nz-popup-link');
      if (linkButton) {
        const id = linkButton.getAttribute('data-id');
        if (id) {
          e.preventDefault();
          navigate(`/stelle/${id}`);
        }
      }
    };

    container.addEventListener('click', handlePopupClick);
    return () => {
      container.removeEventListener('click', handlePopupClick);
    };
  }, [navigate]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--nz-line)' }}>
      <style>{`
        .custom-map-marker-container:hover .map-marker-pin {
          transform: scale(1.15);
        }
        .popup-action-btn:hover {
          background-color: var(--mantine-color-wald-0);
        }
        .leaflet-popup-content-wrapper {
          background-color: var(--nz-cream);
          border-radius: 8px;
          border: 1px solid var(--nz-line);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .leaflet-popup-tip {
          background-color: var(--nz-cream);
          border: 1px solid var(--nz-line);
        }
      `}</style>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
