"""Offline-Geokodierung für Länder und US-Bundesstaaten.

Enthält Centroid-Koordinaten (Breiten- und Längengrade) für alle relevanten
Zielländer und US-Bundesstaaten, um offline ohne Netzwerk/API-Keys zu kartieren.
"""
from __future__ import annotations

# Centroid-Koordinaten für Zielländer (deutschsprachiger Name)
COUNTRY_CENTROIDS: dict[str, tuple[float, float]] = {
    # Europa
    "Deutschland": (51.1657, 10.4515),
    "Österreich": (47.5162, 14.5501),
    "Schweiz": (46.8182, 8.2275),
    "Frankreich": (46.2276, 2.2137),
    "Spanien": (40.4637, -3.7492),
    "Portugal": (39.3999, -8.2245),
    "Italien": (41.8719, 12.5674),
    "Griechenland": (39.0742, 21.8243),
    "Vereinigtes Königreich": (55.3781, -3.4360),
    "Irland": (53.4129, -8.2439),
    "Niederlande": (52.1326, 5.2913),
    "Belgien": (50.5039, 4.4699),
    "Luxemburg": (49.8153, 6.1296),
    "Dänemark": (56.2639, 9.5018),
    "Schweden": (60.1282, 18.6435),
    "Norwegen": (60.4720, 8.4689),
    "Finnland": (61.9241, 25.7482),
    "Island": (64.9631, -19.0208),
    "Polen": (51.9194, 19.1451),
    "Tschechien": (49.8175, 15.4730),
    "Slowakei": (48.6690, 19.6990),
    "Ungarn": (47.1625, 19.5033),
    "Slowenien": (46.1512, 14.9955),
    "Kroatien": (45.1000, 15.2000),
    "Serbien": (44.0165, 21.0059),
    "Bosnien und Herzegowina": (43.9159, 17.6791),
    "Montenegro": (42.7087, 19.3744),
    "Albanien": (41.1533, 20.1683),
    "Nordmazedonien": (41.6086, 21.7453),
    "Bulgarien": (42.7339, 25.4858),
    "Rumänien": (45.9432, 24.9668),
    "Estland": (58.5953, 25.0136),
    "Lettland": (56.8796, 24.6032),
    "Litauen": (55.1694, 23.8813),
    "Ukraine": (48.3794, 31.1656),
    "Moldau": (47.4116, 28.3699),
    "Russland": (61.5240, 105.3188),
    "Zypern": (35.1264, 33.4299),
    "Malta": (35.9375, 14.3754),
    "Liechtenstein": (47.1660, 9.5554),
    "Kosovo": (42.6026, 20.9030),
    "Belarus": (53.7098, 27.9534),

    # Afrika
    "Südafrika": (-30.5595, 22.9375),
    "Namibia": (-22.9576, 18.4904),
    "Botswana": (-22.3285, 24.6849),
    "Simbabwe": (-19.0154, 29.1549),
    "Sambia": (-13.1339, 27.8493),
    "Mosambik": (-18.6657, 35.5296),
    "Kenia": (-0.0236, 37.9062),
    "Tansania": (-6.3690, 34.8888),
    "Uganda": (1.3733, 32.2903),
    "Ruanda": (-1.9403, 29.8739),
    "Äthiopien": (9.1450, 40.4897),
    "Ghana": (7.9465, -1.0232),
    "Senegal": (14.4974, -14.4524),
    "Gambia": (13.4432, -15.3101),
    "Nigeria": (9.0820, 8.6753),
    "Kamerun": (7.3697, 12.3547),
    "Marokko": (31.7917, -7.0926),
    "Tunesien": (33.8869, 9.5375),
    "Ägypten": (26.8206, 30.8025),
    "Madagaskar": (-18.7669, 46.8691),
    "Seychellen": (-4.6796, 55.4920),
    "Malawi": (-13.2543, 34.3015),
    "Algerien": (28.0339, 1.6596),
    "Kongo": (-0.2280, 15.8277),
    "DR Kongo": (-4.0383, 21.7587),
    "Togo": (8.6195, 0.8248),
    "Benin": (9.3077, 2.3158),
    "Mauretanien": (21.0079, -10.9408),
    "Mali": (17.5707, -3.9962),
    "Burkina Faso": (12.2383, -1.5616),
    "Burundi": (-3.3731, 29.9189),
    "Elfenbeinküste": (7.5400, -5.5471),
    "Sierra Leone": (8.4606, -11.7799),
    "Liberia": (6.4281, -9.4295),
    "Guinea": (9.9456, -9.6966),
    "Guinea-Bissau": (11.8037, -15.1804),
    "Niger": (17.6078, 8.0817),
    "Tschad": (15.4542, 18.7322),
    "Sudan": (12.8628, 30.2176),
    "Angola": (-11.2027, 17.8739),
    "Lesotho": (-29.6100, 28.2336),
    "Eswatini": (-26.5225, 31.4659),
    "Kap Verde": (16.0021, -24.0132),

    # Asien
    "Indien": (20.5937, 78.9629),
    "Nepal": (28.3949, 84.1240),
    "Sri Lanka": (7.8731, 80.7718),
    "Thailand": (15.8700, 100.9925),
    "Vietnam": (14.0583, 108.2772),
    "Kambodscha": (12.5657, 104.9910),
    "Laos": (19.8563, 102.4955),
    "Indonesien": (-0.7893, 113.9213),
    "Malaysia": (4.2105, 101.9758),
    "Philippinen": (12.8797, 121.7740),
    "China": (35.8617, 104.1954),
    "Japan": (36.2048, 138.2529),
    "Südkorea": (35.9078, 127.7669),
    "Mongolei": (46.8625, 103.8467),
    "Bangladesch": (23.6850, 90.3563),
    "Myanmar": (21.9162, 95.9560),
    "Israel": (31.0461, 34.8516),
    "Jordanien": (30.5852, 36.2384),
    "Türkei": (38.9637, 35.2433),
    "Singapur": (1.3521, 103.8198),
    "Georgien": (42.3154, 43.3569),
    "Armenien": (40.0691, 45.0382),
    "Aserbaidschan": (40.1431, 47.5769),
    "Libanon": (33.8547, 35.8623),
    "Palästina": (31.9522, 35.2332),
    "Kasachstan": (48.0196, 66.9237),
    "Kirgisistan": (41.2044, 74.7661),
    "Tadschikistan": (38.8610, 71.2761),
    "Usbekistan": (41.3775, 64.5853),
    "Pakistan": (30.3753, 69.3451),
    "Timor-Leste": (-8.8742, 125.7275),

    # Nordamerika
    "USA": (37.0902, -95.7129),
    "Kanada": (56.1304, -106.3468),
    "Mexiko": (23.6345, -102.5528),
    "Costa Rica": (9.7489, -83.7534),
    "Panama": (8.5380, -80.7821),
    "Guatemala": (15.7835, -90.2308),
    "Honduras": (15.1999, -86.2419),
    "Nicaragua": (12.8654, -85.2072),
    "Belize": (17.1899, -88.4976),
    "El Salvador": (13.7942, -88.8965),
    "Kuba": (21.5218, -77.7812),
    "Dominikanische Republik": (18.7357, -70.1627),
    "Jamaika": (18.1096, -77.2975),
    "Bahamas": (25.0343, -77.3963),
    "Trinidad und Tobago": (10.6918, -61.2225),
    "Haiti": (18.9712, -72.2852),

    # Südamerika
    "Brasilien": (-14.2350, -51.9253),
    "Argentinien": (-38.4161, -63.6167),
    "Chile": (-35.6751, -71.5430),
    "Peru": (-9.1900, -75.0152),
    "Ecuador": (-1.8312, -78.1834),
    "Kolumbien": (4.5709, -74.2973),
    "Bolivien": (-16.2902, -63.5887),
    "Paraguay": (-23.4425, -58.4438),
    "Uruguay": (-32.5228, -55.7658),
    "Venezuela": (6.4238, -66.5897),
    "Guyana": (4.8604, -58.9302),
    "Suriname": (3.9193, -56.0278),

    # Ozeanien
    "Australien": (-25.2744, 133.7751),
    "Neuseeland": (-40.9006, 174.8860),
    "Fidschi": (-17.7134, 178.0650),
    "Papua-Neuguinea": (-6.3150, 143.9555),
    "Samoa": (-13.7590, -172.1046),
    "Tonga": (-21.1789, -175.1982),
    "Vanuatu": (-15.3767, 166.9592),
    "Salomonen": (-9.6457, 160.1562),
}

# Centroid-Koordinaten für US-Bundesstaaten (vollständiger deutscher Name)
US_STATE_CENTROIDS: dict[str, tuple[float, float]] = {
    "Alabama": (32.3182, -86.9023),
    "Alaska": (63.5888, -154.4931),
    "Arizona": (34.0489, -111.0937),
    "Arkansas": (35.2010, -91.8318),
    "Kalifornien": (36.7783, -119.4179),
    "Colorado": (39.5501, -105.7821),
    "Connecticut": (41.6032, -73.0877),
    "Delaware": (38.9108, -75.5277),
    "Florida": (27.6648, -81.5158),
    "Georgia": (32.1656, -82.9001),
    "Hawaii": (19.8987, -155.6659),
    "Idaho": (44.0682, -114.7420),
    "Illinois": (40.6331, -89.3985),
    "Indiana": (40.5512, -85.6024),
    "Iowa": (41.8780, -93.0977),
    "Kansas": (39.0119, -98.4842),
    "Kentucky": (37.8393, -84.2700),
    "Louisiana": (31.1695, -91.8678),
    "Maine": (45.2538, -69.4455),
    "Maryland": (39.0458, -76.6413),
    "Massachusetts": (42.4072, -71.3824),
    "Michigan": (44.3148, -85.6024),
    "Minnesota": (46.7296, -94.6859),
    "Mississippi": (32.3547, -89.3985),
    "Missouri": (37.9643, -91.8318),
    "Montana": (46.8797, -110.3626),
    "Nebraska": (41.4925, -99.9018),
    "Nevada": (38.8026, -116.4194),
    "New Hampshire": (43.1939, -71.5724),
    "New Jersey": (40.0583, -74.4057),
    "New Mexico": (34.5199, -105.8701),
    "New York": (43.2994, -74.2179),
    "North Carolina": (35.7596, -79.0193),
    "North Dakota": (47.5515, -101.0020),
    "Ohio": (40.4173, -82.9071),
    "Oklahoma": (35.0078, -97.0929),
    "Oregon": (43.8041, -120.5542),
    "Pennsylvania": (41.2033, -77.1945),
    "Rhode Island": (41.5801, -71.4774),
    "South Carolina": (33.8361, -81.1637),
    "South Dakota": (44.3673, -100.2076),
    "Tennessee": (35.5175, -86.5804),
    "Texas": (31.9686, -99.9018),
    "Utah": (39.3210, -111.0937),
    "Vermont": (44.5588, -72.5778),
    "Virginia": (37.4316, -78.6569),
    "Washington": (47.7511, -120.7401),
    "West Virginia": (38.5976, -80.4549),
    "Wisconsin": (43.7844, -88.7879),
    "Wyoming": (43.0760, -107.2903),
    "District of Columbia": (38.9072, -77.0369),
    "Puerto Rico": (18.2208, -66.5901),
}


def geokodiere(
    land: str | None, region: str | None
) -> tuple[float | None, float | None, str, str | None]:
    """Wandelt ein Land und eine Region in Koordinaten und Genauigkeit um.

    Gibt (geo_lat, geo_lon, geo_genauigkeit, geo_label) zurück.
    """
    if not land:
        return None, None, "unbekannt", None

    land_clean = land.strip()
    if land_clean in ("", "Weltweit", "Ort offen", "unbekannt"):
        return None, None, "unbekannt", None

    region_clean = region.strip() if region else ""

    # 1) Erkennung von US-Bundesstaaten bei Land "USA"
    if land_clean == "USA" and region_clean:
        from sources.geo import _US_STATES

        reg_lower = region_clean.lower()
        state_key = None

        # Suche nach Abkürzung oder Name des Staates
        for abbr, name in _US_STATES.items():
            if (
                reg_lower == abbr
                or reg_lower == name.lower()
                or reg_lower.endswith(" " + abbr)
                or reg_lower.endswith(" " + name.lower())
            ):
                state_key = name
                break

        if state_key and state_key in US_STATE_CENTROIDS:
            lat, lon = US_STATE_CENTROIDS[state_key]
            # Region-genaue Koordinate
            return lat, lon, "region", f"{state_key}, USA"

    # 2) Standard: Land-Centroid
    if land_clean in COUNTRY_CENTROIDS:
        lat, lon = COUNTRY_CENTROIDS[land_clean]
        return lat, lon, "land", land_clean

    return None, None, "unbekannt", None
