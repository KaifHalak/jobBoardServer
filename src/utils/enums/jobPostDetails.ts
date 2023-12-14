enum JobTypes {
    Fulltime = "Full Time",
    PartTime = "Part Time",
    Internship = "Internship",
    Contract = "Contract",
    Remote = "Remote"
}

const Locations = {  
    "Japan": [
      "Osaka",
      "Nagoya",
      "Yokohama",
      "Fukuoka"
    ],
    "Indonesia": [
      "Surabaya",
      "Medan",
      "Malang",
      "Bekasi"
    ],
    "India": [
      "Mumbai",
      "Kolkata",
      "Bangalore",
      "Chennai"
    ],
    "China": [
      "Shanghai",
      "Beijing",
      "Shenzhen",
      "Chengdu"
    ],
    "Philippines": [
      "Quezon City",
      "Davao",
      "Caloocan City",
      "Canagatan"
    ],
    "South Korea": [
      "Busan",
      "Incheon",
      "Daegu",
      "Gwangju"
    ],
    "Mexico": [
      "Guadalajara",
      "Monterrey",
      "Tijuana",
      "Ecatepec"
    ],
    "Egypt": [
      "Giza",
      "Alexandria",
      "Shubra al Khaymah",
      "Al Mansurah"
    ],
    "United States": [
      "Los Angeles",
      "Chicago",
      "Miami",
      "Dallas"
    ],
    "Bangladesh": [
      "Chattogram",
      "Narayanganj",
      "Khulna",
      "Gazipura"
    ],
    "Thailand": [
      "Chiang Mai",
      "Nonthaburi",
      "Pak Kret",
      "Hat Yai"
    ],
    "Russia": [
      "Saint Petersburg",
      "Novosibirsk",
      "Yekaterinburg",
      "Nizhniy Novgorod"
    ],
    "Argentina": [
      "Rosario",
      "Santiago del Estero",
      "Comodoro Rivadavia",
      "Mar del Plata"
    ],
    "Nigeria": [
      "Kano",
      "Abuja",
      "Ibadan",
      "Port Harcourt"
    ],
    "Turkey": [
      "Ankara",
      "Izmir",
      "Bursa",
      "Antalya"
    ],
    "Pakistan": [
      "Lahore",
      "Faisalabad",
      "Rawalpindi",
      "Gujranwala"
    ],
    "Vietnam": [
      "Hanoi",
      "Haiphong",
      "Vinh",
      "Nha Trang"
    ],
    "Iran": [
      "Kashan",
      "Mashhad",
      "Esfahan",
      "Karaj"
    ],
    "Brazil": [
      "Belo Horizonte",
      "Salvador",
      "Fortaleza",
      "Manaus"
    ],
    "United Kingdom": [
      "Birmingham",
      "Manchester",
      "Liverpool",
      "Portsmouth"
    ],
    "France": [
      "Marseille",
      "Lyon",
      "Toulouse",
      "Nice"
    ],
    "Peru": [
      "Callao",
      "Arequipa",
      "Trujillo",
      "Chiclayo"
    ],
    "Taiwan": [
      "Taichung",
      "Kaohsiung",
      "Tainan",
      "Zhongli"
    ],
    "Angola": [
      "Cacuaco",
      "Lubango",
      "Cabinda",
      "Huambo"
    ],
    "Malaysia": [
      "Putrajaya",
      "Seberang Jaya",
      "Klang",
      "Ipoh"
    ],
    "South Africa": [
      "Soweto",
      "Vereeniging",
      "Pretoria",
      "Cape Town"
    ],
    "Tanzania": [
      "Dodoma",
      "Mwanza",
      "Mbeya",
      "Arusha"
    ],
    "Sudan": [
      "Omdurman",
      "Al Mijlad",
      "Khartoum North",
      "Port Sudan"
    ],
    "Hong Kong": [
      "Kowloon",
      "Sha Tin",
      "Kowloon City",
      "Sham Shui Po"
    ],
    "Saudi Arabia": [
      "Jeddah",
      "Mecca",
      "Medina",
      "Ad Dammam"
    ],
    "Chile": [
      "Puente Alto",
      "La Florida",
      "Antofagasta",
      "San Bernardo"
    ],
    "Spain": [
      "Barcelona",
      "Sevilla",
      "Valencia",
      "Bilbao"
    ],
    "Iraq": [
      "Mosul",
      "Al Basrah",
      "Kirkuk",
      "As Sulaymaniyah"
    ],
    "Cameroon": [
      "Bamenda",
      "Bafoussam",
      "Garoua",
      "Maroua"
    ],
    "Kenya": [
      "Meru",
      "Mombasa",
      "Kisumu",
      "Nakuru"
    ],
    "Canada": [
      "Vancouver",
      "Calgary",
      "Edmonton",
      "Ottawa"
    ],
    "Myanmar": [
      "Mandalay",
      "Nay Pyi Taw",
      "Kyaukse",
      "Maungdaw"
    ],
    "Australia": [
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide"
    ],
    "Germany": [
      "Stuttgart",
      "Munich",
      "Hamburg",
      "Cologne"
    ],
    "Morocco": [
      "El Kelaa des Srarhna",
      "Rabat",
      "Tifariti",
      "Tangier"
    ],
    "Afghanistan": [
      "Kandahar",
      "Herat",
      "Farah",
      "Lashkar Gah"
    ],
    "Somalia": [
      "Boosaaso",
      "Hargeysa",
      "Baidoa",
      "Gaalkacyo"
    ],
    "Jordan": [
      "Al Mafraq",
      "Irbid",
      "Ar Rusayfah",
      "Ar Ramtha"
    ],
    "Algeria": [
      "Oran",
      "Constantine",
      "Blida",
      "Batna"
    ],
    "Ghana": [
      "Accra",
      "Kumasi",
      "Tamale",
      "Sekondi"
    ],
    "United Arab Emirates": [
      "Abu Dhabi",
      "Sharjah",
      "Al Fujayrah",
      "Umm al Qaywayn"
    ],
    "Bolivia": [
      "La Paz",
      "Sucre",
      "El Alto",
      "Cochabamba"
    ],
    "Greece": [
      "Piraeus",
      "Kos",
      "Thebes"
    ],
    "Ethiopia": [
      "Gode",
      "Erer Sata",
      "Nazret",
      "Gonder"
    ],
    "Kuwait": [
      "Ar Riqqah"
    ],
    "Hungary": [
      "Debrecen",
      "Gyor",
      "Szeged",
      "Miskolc"
    ],
    "Ukraine": [
      "Kharkiv",
      "Odesa",
      "Dnipro",
      "Donetsk"
    ],
    "Yemen": [
      "Aden",
      "Ibb",
      "Ibb",
      "Dhamar"
    ],
    "Guatemala": [
      "Villa Nueva",
      "Mixco",
      "Coatepeque",
      "Quetzaltenango"
    ],
    "Italy": [
      "Milan",
      "Naples",
      "Turin",
      "Palermo"
    ],
    "North Korea": [
      "Hamhung",
      "Nampo",
      "Wonsan",
      "Sinuiju"
    ],
    "Ecuador": [
      "Quito",
      "Cuenca",
      "Santo Domingo de los Colorados",
      "Machala"
    ],
    "Portugal": [
      "Porto",
      "Aves",
      "Sintra",
      "Vila Nova de Gaia"
    ],
    "Venezuela": [
      "Caracas",
      "Valencia",
      "Barquisimeto",
      "Barinas"
    ],
    "Madagascar": [
      "Androtsy",
      "Betsiboka",
      "Ihosy",
      "Antsirabe"
    ],
    "Dominican Republic": [
      "Santiago",
      "Santo Domingo Este",
      "Puerto Plata",
      "La Victoria"
    ],
    "Uzbekistan": [
      "Namangan",
      "Samarkand",
      "Andijon",
      "Nukus"
    ],
    "Colombia": [
      "Barranquilla",
      "Cartagena",
      "Bucaramanga",
      "Palermo"
    ],
    "Zambia": [
      "Ndola",
      "Kitwe",
      "Kafue",
      "Mazabuka"
    ],
    "Burkina Faso": [
      "Koudougou",
      "Ouahigouya",
      "Kaya",
      "Banfora"
    ],
    "Sri Lanka": [
      "Sri Jayewardenepura Kotte",
      "Mount Lavinia",
      "Kesbewa",
      "Moratuwa"
    ],
    "Azerbaijan": [
      "Sumqayit",
      "Xirdalan",
      "Sirvan",
      "Yevlax"
    ],
    "Zimbabwe": [
      "Bulawayo",
      "Chitungwiza",
      "Mutare",
      "Gweru"
    ],
    "Cuba": [
      "Santiago de Cuba",
      "Santa Clara",
      "Bayamo",
      "Arroyo Naranjo"
    ],
    "Cambodia": [
      "Siem Reap",
      "Battambang",
      "Kampong Cham",
      "Paoy Paet"
    ],
    "Mali": [
      "Balandougou",
      "Sikasso",
      "Mopti",
      "Koutiala"
    ],
    "Belarus": [
      "Vitsyebsk",
      "Mahilyow",
      "Hrodna",
      "Brest"
    ],
    "Austria": [
      "Graz",
      "Linz",
      "Salzburg",
      "Innsbruck"
    ],
    "Syria": [
      "Damascus",
      "Homs",
      "Latakia",
      "Ar Raqqah"
    ],
    "Kazakhstan": [
      "Shymkent",
      "Qaraghandy",
      "Taraz",
      "Pavlodar"
    ],
    "Puerto Rico": [
      "Aguadilla",
      "Carolina",
      "Ponce",
      "Arecibo"
    ],
    "Malawi": [
      "Lilongwe",
      "Mzuzu",
      "Zomba",
      "Salima"
    ],
    "Romania": [
      "Timisoara",
      "Iasi",
      "Brasov",
      "Constanta"
    ],
    "Poland": [
      "Wroclaw",
      "Poznan",
      "Gdansk",
      "Szczecin"
    ],
    "Belgium": [
      "Antwerp",
      "Gent",
      "Charleroi",
      "Anderlecht"
    ],
    "Uruguay": [
      "Salto",
      "Ciudad de la Costa",
      "Maldonado",
      "Las Piedras"
    ],
    "Uganda": [
      "Mbale",
      "Nansana",
      "Arua",
      "Kasangati"
    ],
    "Honduras": [
      "San Pedro Sula",
      "Choloma",
      "La Ceiba",
      "El Progreso"
    ],
    "Guinea": [
      "Mamou",
      "Kankan",
      "Siguiri",
      "Kindia"
    ],
    "Sweden": [
      "Gothenburg",
      "Uppsala",
      "Uppsala",
      "Helsingborg"
    ],
    "Bulgaria": [
      "Plovdiv",
      "Varna",
      "Burgas",
      "Ruse"
    ],
    "Panama": [
      "San Miguelito",
      "David",
      "La Chorrera",
      "Santiago"
    ],
    "Netherlands": [
      "The Hague",
      "Rotterdam",
      "Utrecht",
      "Maastricht"
    ],
    "Senegal": [
      "Pikine",
      "Touba",
      "Dagana",
      "Rufisque"
    ],
    "Oman": [
      "Bawshar",
      "As Sib",
      "Salalah",
      "As Suwayq"
    ],
    "Mongolia": [
      "Erdenet",
      "Darhan",
      "Choybalsan",
      "Bayanhongor"
    ],
    "Serbia": [
      "Novi Sad",
      "Zemun",
      "Kragujevac",
      "Valjevo"
    ],
    "Denmark": [
      "Aarhus",
      "Odense",
      "Aalborg",
      "Vejle"
    ],
    "New Zealand": [
      "Wellington",
      "Christchurch",
      "Manukau City",
      "Northcote"
    ],
    "Czechia": [
      "Olomouc",
      "Brno",
      "Ostrava",
      "Plzen"
    ],
    "Libya": [
      "Benghazi",
      "Ajdabiya",
      "Misratah",
      "Al Khums"
    ],
    "Finland": [
      "Tampere",
      "Espoo",
      "Turku",
      "Vantaa"
    ],
    "Qatar": [
      "Ar Rayyan",
      "Al Khawr",
      "Al Wakrah",
      "Madinat ash Shamal"
    ],
    "Mozambique": [
      "Matola",
      "Nampula",
      "Beira",
      "Chimoio"
    ],
    "Ireland": [
      "Finglas",
      "Cork",
      "Tallaght",
      "Galway"
    ],
    "Rwanda": [
      "Nyanza",
      "Gisenyi",
      "Ruhengeri",
      "Byumba"
    ],
    "Georgia": [
      "Batumi",
      "Kutaisi",
      "Rustavi",
      "Sokhumi"
    ],
    "Burundi": [
      "Gitega",
      "Ngozi",
      "Rumonge",
      "Cibitoke"
    ],
    "Kyrgyzstan": [
      "Osh",
      "Karakol",
      "Talas",
      "Naryn"
    ],
    "Armenia": [
      "Gyumri",
      "Vanadzor",
      "Hrazdan",
      "Abovyan"
    ],
    "Mauritania": [
      "Nouadhibou",
      "Arafat",
      "Kiffa",
      "Dar Naim"
    ],
    "Norway": [
      "Bergen",
      "Stavanger",
      "Sandnes",
      "Trondheim"
    ],
    "Tunisia": [
      "Sidi Bouzid",
      "Sfax",
      "Sousse",
      "Kairouan"
    ],
    "Nicaragua": [
      "Boaco",
      "Masaya",
      "Matagalpa",
      "Chinandega"
    ],
    "Niger": [
      "Maradi",
      "Zinder",
      "Tahoua",
      "Agadez"
    ],
    "Liberia": [
      "New Kru Town",
      "Gbarnga",
      "Buchanan",
      "Kakata"
    ],
    "Nepal": [
      "Bharatpur",
      "Pokhara",
      "Jitpur",
      "Ghorahi"
    ],
    "Eritrea": [
      "Keren",
      "Assab",
      "Massawa",
      "Mendefera"
    ],
    "Sierra Leone": [
      "Bo",
      "Kenema",
      "Koidu",
      "Makeni"
    ],
    "Laos": [
      "Xiangkhoang",
      "Savannakhet",
      "Louangphabang",
      "Xam Nua"
    ],
    "Israel": [
      "Haifa",
      "Ashdod",
      "Netanya",
      "Beersheba"
    ],
    "Latvia": [
      "Daugavpils",
      "Liepaja",
      "Jelgava",
      "Jurmala"
    ],
    "Central African Republic": [
      "Bimo",
      "Bimbo",
      "Bambari",
      "Nola"
    ],
    "Tajikistan": [
      "Khujand",
      "Konibodom",
      "Kulob",
      "Bokhtar"
    ],
    "Turkmenistan": [
      "Dasoguz",
      "Mary",
      "Balkanabat",
      "Koytendag"
    ],
    "Croatia": [
      "Rijeka",
      "Split",
      "Osijek",
      "Zadar"
    ],
    "Gabon": [
      "Franceville",
      "Owendo",
      "Oyem",
      "Tchibanga"
    ],
    "Benin": [
      "Banikoara",
      "Djougou",
      "Tchaourou",
      "Parakou"
    ],
    "Lithuania": [
      "Kaunas",
      "Klaipeda",
      "Alytus",
      "Marijampole"
    ],
    "Moldova": [
      "Tiraspol",
      "Balti",
      "Bender",
      "Ungheni"
    ],
    "Papua New Guinea": [
      "Lae",
      "Popondetta",
      "Madang",
      "Mendi"
    ],
    "Macedonia": [
      "Tetovo",
      "Bitola",
      "Kumanovo",
      "Prilep"
    ],
    "Djibouti": [
      "Arta",
      "Ali Sabieh",
      "Dikhil",
      "Obock"
    ],
    "Gaza Strip": [
      "Khan Yunis",
      "Jabalya",
      "Bayt Lahya",
      "Bani Suhayla"
    ],
    "Jamaica": [
      "Portmore",
      "May Pen",
      "Spanish Town",
      "Montego Bay"
    ],
    "El Salvador": [
      "Santa Ana",
      "San Miguel",
      "Santa Tecla",
      "Mejicanos"
    ],
    "South Sudan": [
      "Bor",
      "Kajo Kaji",
      "Yei",
      "Magwe"
    ],
    "Lesotho": [
      "Teyateyaneng",
      "Mafeteng",
      "Leribe",
      "Quthing"
    ],
    "Malta": [
      "Sliema",
      "Birkirkara",
      "Mosta",
      "Fgura"
    ],
    "Slovakia": [
      "Nitra",
      "Trnava",
      "Martin",
      "Poprad"
    ],
    "Bahrain": [
      "Sitrah",
      "Al Hamalah",
      "Ad Diraz",
      "Al Malikiyah"
    ],
    "Estonia": [
      "Tartu",
      "Viljandi",
      "Rakvere",
      "Kuressaare"
    ],
    "Lebanon": [
      "Tripoli",
      "Sidon",
      "Borj Hammoud",
      "Tyre"
    ],
    "Albania": [
      "Fier",
      "Elbasan",
      "Berat",
      "Peshkopi"
    ],
    "Bosnia and Herzegovina": [
      "Banja Luka",
      "Bijeljina",
      "Mostar",
      "Tuzla"
    ],
    "The Gambia": [
      "Serekunda",
      "Brikama",
      "Bakau",
      "Sukuta"
    ],
    "Cyprus": [
      "Limassol",
      "Larnaca",
      "Paphos",
      "Famagusta"
    ],
    "Namibia": [
      "Rundu",
      "Oshakati",
      "Swakopmund",
      "Otjiwarongo"
    ],
    "Slovenia": [
      "Maribor",
      "Celje",
      "Kranj",
      "Koper"
    ],
    "The Bahamas": [
      "Freeport City",
      "West End"
    ],
    "Botswana": [
      "Francistown",
      "Molepolole",
      "Maun",
      "Selibe Phikwe"
    ],
    "Suriname": [
      "Lelydorp",
      "Nieuw Nickerie",
      "Brokopondo",
      "Nieuw Amsterdam"
    ],
    "Guyana": [
      "New Amsterdam",
      "Linden",
      "Bartica",
      "Lethem"
    ],
    "Equatorial Guinea": [
      "Bata",
      "Evinayong",
      "Luba",
      "Mongomo"
    ],
    "Fiji": [
      "Nausori",
      "Lautoka",
      "Nakasi",
      "Lami"
    ],
    "Kosovo": [
      "Ferizaj",
      "Prizren",
      "Vushtrri",
      "Gllogovc"
    ],
    "Maldives": [
      "Ungoofaaru",
      "Mahibadhoo",
      "Kulhudhuffushi",
      "Foammulah"
    ],
    "Mauritius": [
      "Curepipe",
      "Quatre Bornes",
      "Le Hochet",
      "Quartier Militaire"
    ],
    "Montenegro": [
      "Ulcinj",
      "Herceg Novi",
      "Budva",
      "Pljevlja"
    ],
    "Switzerland": [
      "Geneva",
      "Basel",
      "Lausanne",
      "Winterthur"
    ],
    "Luxembourg": [
      "Diekirch",
      "Echternach",
      "Wiltz",
      "Grevenmacher"
    ],
    "Cabo Verde": [
      "Mindelo",
      "Ribeira Grande",
      "Tarrafal",
      "Porto Novo"
    ],
    "Comoros": [
      "Mutsamudu",
      "Fomboni",
      "Ouani",
      "Mandza"
    ],
    "Bhutan": [
      "Paro",
      "Samdrup Jongkhar",
      "Wangdue Phodrang",
      "Punakha"
    ],
    "Swaziland": [
      "Lobamba",
      "Manzini",
      "Siteki",
      "Nhlangano"
    ],
    "Solomon Islands": [
      "Auki",
      "Gizo",
      "Kirakira",
      "Buala"
    ],
    "Trinidad and Tobago": [
      "Chaguanas",
      "San Fernando",
      "Arima",
      "Couva"
    ],
    "Saint Lucia": [
      "Gros Islet",
      "Micoud",
      "Vieux Fort",
      "Bisee"
    ],
    "French Guiana": [
      "Kourou",
      "Sinnamary",
      "Roura",
      "Iracoubo"
    ],
    "Brunei": [
      "Kuala Belait",
      "Bangar",
      "Tutong",
      "Seria"
    ],
    "Samoa": [
      "Afega",
      "Leulumoega",
      "Safotu",
      "Asau"
    ],
    "Kiribati": [
      "Betio"
    ],
    "Aruba": [
      "Tanki Leendert"
    ],
    "Isle Of Man": [
      "Onchan"
    ],
    "Saint Vincent and the Grenadines": [
      "Calliaqua"
    ],
    "Andorra": [
      "Encamp",
      "La Massana",
      "Ordino",
      "Canillo"
    ],
    "Greenland": [
      "Sisimiut",
      "Ilulissat",
      "Qaqortoq",
      "Aasiaat"
    ],
    "Belize": [
      "Belize City",
      "Orange Walk",
      "San Ignacio",
      "Dangriga"
    ],
    "Federated States of Micronesia": [
      "Kolonia",
      "Colonia",
      "Tofol",
      "Weno"
    ],
    "Liechtenstein": [
      "Schaan",
      "Triesen",
      "Mauren",
      "Eschen"
    ],
    "San Marino": [
      "Serravalle",
      "Borgo Maggiore",
      "Domagnano",
      "Fiorentino"
    ],
    "Palau": [
      "Koror",
      "Melekeok"
    ],
    "Haiti": [
      "Delmas",
      "Les Cayes",
      "Jacmel",
      "Tabarre"
    ],
    "Paraguay": [
      "San Lorenzo",
      "Luque",
      "Fernando de la Mora",
      "Pedro Juan Caballero"
    ],
    "West Bank": [
      "Nablus",
      "Qalqilyah",
      "Yattir",
      "Tulkarm"
    ],
    "Costa Rica": [
      "Alajuela",
      "Liberia",
      "Desamparados",
      "Puntarenas"
    ],
    "Chad": [
      "Sarh",
      "Faya",
      "Koumra",
      "Doba"
    ],
    "Togo": [
      "Kara",
      "Badou",
      "Bassar",
      "Bafilo"
    ],
    "Vanuatu": [
      "Isangel",
      "Lakatoro",
      "Saratamata",
      "Sola"
    ],
    "Sao Tome and Principe": [
      "Neves",
      "Guadalupe",
      "Trindade"
    ],
    "Faroe Islands": [
      "Skopun",
      "Hvannasund",
      "Toftir",
      "Porkeri"
    ],
    "Iceland": [
      "Selfoss",
      "Borgarnes"
    ]
} 




export {Locations, JobTypes}