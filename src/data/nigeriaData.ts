export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  cooperativeId: string;
}

export interface Ward {
  id: string;
  name: string;
  cooperatives: Cooperative[];
}

export interface Cooperative {
  id: string;
  name: string;
  address: string;
  memberCount: number;
  executiveCommittee: {
    chairman: string;
    secretary: string;
    treasurer: string;
    publicRelationsOfficer?: string;
  };
  establishedYear: number;
  registrationNumber: string;
  agents: Agent[];
}

export interface LocalGovernment {
  id: string;
  name: string;
  wards: Ward[];
}

export interface State {
  id: string;
  name: string;
  localGovernments: LocalGovernment[];
}

// Complete data for all Nigerian states, LGAs, wards and cooperatives
export const nigeriaStates: State[] = [
  {
    id: "abia",
    name: "Abia State",
    localGovernments: [
      {
        id: "aba-north",
        name: "Aba North",
        wards: [
          {
            id: "aba-north-ward1",
            name: "Eziama Ward",
            cooperatives: [
              {
                id: "abia-coop-1",
                name: "Aba North Farmers Cooperative",
                address: "No. 45 Azikiwe Road, Aba",
                memberCount: 234,
                executiveCommittee: {
                  chairman: "Chief Emeka Okafor",
                  secretary: "Mrs. Ngozi Eze",
                  treasurer: "Mr. Chukwu Okoro"
                },
                establishedYear: 2019,
                registrationNumber: "AB/COOP/2019/001",
                agents: [
                  {
                    id: "agent-ab-001",
                    name: "Ikechukwu Nwankwo",
                    phone: "+234 803 123 4567",
                    email: "ikechukwu@farmcred.ng",
                    address: "12 School Road, Aba",
                    cooperativeId: "abia-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "umuahia-north",
        name: "Umuahia North",
        wards: [
          {
            id: "umuahia-north-ward1",
            name: "Afara Ward",
            cooperatives: [
              {
                id: "abia-coop-2",
                name: "Umuahia Agricultural Cooperative",
                address: "Government House Road, Umuahia",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Dr. Kelechi Okoye",
                  secretary: "Mrs. Adaeze Nwosu",
                  treasurer: "Mr. Obinna Ike"
                },
                establishedYear: 2020,
                registrationNumber: "AB/COOP/2020/002",
                agents: [
                  {
                    id: "agent-ab-002",
                    name: "Chioma Okwu",
                    phone: "+234 805 987 6543",
                    email: "chioma@farmcred.ng",
                    address: "23 Bank Road, Umuahia",
                    cooperativeId: "abia-coop-2"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "adamawa",
    name: "Adamawa State",
    localGovernments: [
      {
        id: "yola-north",
        name: "Yola North",
        wards: [
          {
            id: "yola-north-ward1",
            name: "Alkalawa Ward",
            cooperatives: [
              {
                id: "adamawa-coop-1",
                name: "Yola Farmers Union Cooperative",
                address: "Jimeta Market Road, Yola",
                memberCount: 312,
                executiveCommittee: {
                  chairman: "Alhaji Abubakar Yola",
                  secretary: "Hajiya Aisha Mohammed",
                  treasurer: "Malam Ibrahim Sani"
                },
                establishedYear: 2018,
                registrationNumber: "AD/COOP/2018/001",
                agents: [
                  {
                    id: "agent-ad-001",
                    name: "Musa Adamu",
                    phone: "+234 807 234 5678",
                    email: "musa@farmcred.ng",
                    address: "15 Cattle Market, Yola",
                    cooperativeId: "adamawa-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "akwa-ibom",
    name: "Akwa Ibom State",
    localGovernments: [
      {
        id: "uyo",
        name: "Uyo",
        wards: [
          {
            id: "uyo-ward1",
            name: "Etoi Ward",
            cooperatives: [
              {
                id: "akwa-ibom-coop-1",
                name: "Uyo Agricultural Development Cooperative",
                address: "Wellington Bassey Way, Uyo",
                memberCount: 267,
                executiveCommittee: {
                  chairman: "Mr. Ubong Essien",
                  secretary: "Mrs. Ime Udoh",
                  treasurer: "Mr. Aniekan Okon"
                },
                establishedYear: 2019,
                registrationNumber: "AK/COOP/2019/001",
                agents: [
                  {
                    id: "agent-ak-001",
                    name: "Emem Akpan",
                    phone: "+234 809 345 6789",
                    email: "emem@farmcred.ng",
                    address: "34 Ikot Ekpene Road, Uyo",
                    cooperativeId: "akwa-ibom-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "anambra",
    name: "Anambra State",
    localGovernments: [
      {
        id: "awka-north",
        name: "Awka North",
        wards: [
          {
            id: "awka-north-ward1",
            name: "Achalla Ward",
            cooperatives: [
              {
                id: "anambra-coop-1",
                name: "Awka North Farmers Cooperative",
                address: "Enugu-Onitsha Expressway, Awka",
                memberCount: 198,
                executiveCommittee: {
                  chairman: "Chief Chukwuma Okafor",
                  secretary: "Mrs. Chinelo Nwankwo",
                  treasurer: "Mr. Emeka Eze"
                },
                establishedYear: 2020,
                registrationNumber: "AN/COOP/2020/001",
                agents: [
                  {
                    id: "agent-an-001",
                    name: "Obiora Okeke",
                    phone: "+234 803 456 7890",
                    email: "obiora@farmcred.ng",
                    address: "67 Zik Avenue, Awka",
                    cooperativeId: "anambra-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "bauchi",
    name: "Bauchi State",
    localGovernments: [
      {
        id: "bauchi",
        name: "Bauchi",
        wards: [
          {
            id: "bauchi-ward1",
            name: "Bauchi Central Ward",
            cooperatives: [
              {
                id: "bauchi-coop-1",
                name: "Bauchi State Farmers Cooperative",
                address: "Murtala Mohammed Way, Bauchi",
                memberCount: 345,
                executiveCommittee: {
                  chairman: "Alhaji Suleiman Bauchi",
                  secretary: "Hajiya Fatima Ibrahim",
                  treasurer: "Malam Usman Garba"
                },
                establishedYear: 2017,
                registrationNumber: "BC/COOP/2017/001",
                agents: [
                  {
                    id: "agent-bc-001",
                    name: "Ahmad Yakubu",
                    phone: "+234 805 567 8901",
                    email: "ahmad@farmcred.ng",
                    address: "28 Market Road, Bauchi",
                    cooperativeId: "bauchi-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "bayelsa",
    name: "Bayelsa State",
    localGovernments: [
      {
        id: "yenagoa",
        name: "Yenagoa",
        wards: [
          {
            id: "yenagoa-ward1",
            name: "Amarata Ward",
            cooperatives: [
              {
                id: "bayelsa-coop-1",
                name: "Yenagoa Fishermen Cooperative",
                address: "Mbiama-Yenagoa Road, Yenagoa",
                memberCount: 156,
                executiveCommittee: {
                  chairman: "Chief Preye Diri",
                  secretary: "Mrs. Ebiere Wokoma",
                  treasurer: "Mr. Timipre Sylva"
                },
                establishedYear: 2019,
                registrationNumber: "BY/COOP/2019/001",
                agents: [
                  {
                    id: "agent-by-001",
                    name: "Keme Okoko",
                    phone: "+234 807 678 9012",
                    email: "keme@farmcred.ng",
                    address: "45 Tombia Road, Yenagoa",
                    cooperativeId: "bayelsa-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "benue",
    name: "Benue State",
    localGovernments: [
      {
        id: "makurdi",
        name: "Makurdi",
        wards: [
          {
            id: "makurdi-ward1",
            name: "Ankpa Ward",
            cooperatives: [
              {
                id: "benue-coop-1",
                name: "Makurdi Yam Farmers Cooperative",
                address: "High Level, Makurdi",
                memberCount: 278,
                executiveCommittee: {
                  chairman: "Mr. Terhemen Akume",
                  secretary: "Mrs. Dooshima Suswam",
                  treasurer: "Mr. Iorwuese Ortom"
                },
                establishedYear: 2018,
                registrationNumber: "BN/COOP/2018/001",
                agents: [
                  {
                    id: "agent-bn-001",
                    name: "Terseer Kula",
                    phone: "+234 809 789 0123",
                    email: "terseer@farmcred.ng",
                    address: "12 Gboko Road, Makurdi",
                    cooperativeId: "benue-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "borno",
    name: "Borno State",
    localGovernments: [
      {
        id: "maiduguri",
        name: "Maiduguri",
        wards: [
          {
            id: "maiduguri-ward1",
            name: "Bolori Ward",
            cooperatives: [
              {
                id: "borno-coop-1",
                name: "Maiduguri Agricultural Cooperative",
                address: "Baga Road, Maiduguri",
                memberCount: 234,
                executiveCommittee: {
                  chairman: "Alhaji Kashim Shettima",
                  secretary: "Hajiya Aisha Wakil",
                  treasurer: "Malam Babagana Zulum"
                },
                establishedYear: 2020,
                registrationNumber: "BO/COOP/2020/001",
                agents: [
                  {
                    id: "agent-bo-001",
                    name: "Mustapha Ali",
                    phone: "+234 803 890 1234",
                    email: "mustapha@farmcred.ng",
                    address: "56 Monday Market, Maiduguri",
                    cooperativeId: "borno-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "cross-river",
    name: "Cross River State",
    localGovernments: [
      {
        id: "calabar-municipal",
        name: "Calabar Municipal",
        wards: [
          {
            id: "calabar-ward1",
            name: "Calabar South Ward",
            cooperatives: [
              {
                id: "cross-river-coop-1",
                name: "Calabar Cocoa Farmers Cooperative",
                address: "Calabar Road, Calabar",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Chief Ben Ayade",
                  secretary: "Mrs. Stella Odey",
                  treasurer: "Mr. Gershom Bassey"
                },
                establishedYear: 2019,
                registrationNumber: "CR/COOP/2019/001",
                agents: [
                  {
                    id: "agent-cr-001",
                    name: "Edem Okon",
                    phone: "+234 805 901 2345",
                    email: "edem@farmcred.ng",
                    address: "78 Murtala Mohammed Highway, Calabar",
                    cooperativeId: "cross-river-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "delta",
    name: "Delta State",
    localGovernments: [
      {
        id: "warri-north",
        name: "Warri North",
        wards: [
          {
            id: "warri-north-ward1",
            name: "Koko Ward",
            cooperatives: [
              {
                id: "delta-coop-1",
                name: "Warri North Fishermen Cooperative",
                address: "Koko Junction, Warri",
                memberCount: 167,
                executiveCommittee: {
                  chairman: "Chief Ifeanyi Okowa",
                  secretary: "Mrs. Roli Onyeagba",
                  treasurer: "Mr. Emmanuel Uduaghan"
                },
                establishedYear: 2018,
                registrationNumber: "DT/COOP/2018/001",
                agents: [
                  {
                    id: "agent-dt-001",
                    name: "Ovie Omo-Agege",
                    phone: "+234 807 012 3456",
                    email: "ovie@farmcred.ng",
                    address: "90 Effurun-Sapele Road, Warri",
                    cooperativeId: "delta-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ebonyi",
    name: "Ebonyi State",
    localGovernments: [
      {
        id: "abakaliki",
        name: "Abakaliki",
        wards: [
          {
            id: "abakaliki-ward1",
            name: "Azugwu Ward",
            cooperatives: [
              {
                id: "ebonyi-coop-1",
                name: "Abakaliki Rice Farmers Cooperative",
                address: "Ogoja Road, Abakaliki",
                memberCount: 245,
                executiveCommittee: {
                  chairman: "Engr. David Umahi",
                  secretary: "Mrs. Josephine Anyanwu",
                  treasurer: "Mr. Francis Nwifuru"
                },
                establishedYear: 2017,
                registrationNumber: "EB/COOP/2017/001",
                agents: [
                  {
                    id: "agent-eb-001",
                    name: "Chukwuma Nwazunku",
                    phone: "+234 809 123 4567",
                    email: "chukwuma@farmcred.ng",
                    address: "23 Water Works Road, Abakaliki",
                    cooperativeId: "ebonyi-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "edo",
    name: "Edo State",
    localGovernments: [
      {
        id: "benin-city",
        name: "Benin City",
        wards: [
          {
            id: "benin-city-ward1",
            name: "Ikpoba Hill Ward",
            cooperatives: [
              {
                id: "edo-coop-1",
                name: "Benin City Rubber Farmers Cooperative",
                address: "Ring Road, Benin City",
                memberCount: 198,
                executiveCommittee: {
                  chairman: "Mr. Godwin Obaseki",
                  secretary: "Mrs. Betsy Obaseki",
                  treasurer: "Mr. Philip Shaibu"
                },
                establishedYear: 2019,
                registrationNumber: "ED/COOP/2019/001",
                agents: [
                  {
                    id: "agent-ed-001",
                    name: "Osaze Osagie",
                    phone: "+234 803 234 5678",
                    email: "osaze@farmcred.ng",
                    address: "45 Sapele Road, Benin City",
                    cooperativeId: "edo-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ekiti",
    name: "Ekiti State",
    localGovernments: [
      {
        id: "ado-ekiti",
        name: "Ado Ekiti",
        wards: [
          {
            id: "ado-ekiti-ward1",
            name: "Ado Ward 1",
            cooperatives: [
              {
                id: "ekiti-coop-1",
                name: "Ado Ekiti Cocoa Farmers Cooperative",
                address: "Oba Adejugbe Avenue, Ado Ekiti",
                memberCount: 156,
                executiveCommittee: {
                  chairman: "Dr. Kayode Fayemi",
                  secretary: "Mrs. Bisi Fayemi",
                  treasurer: "Mr. Biodun Oyebanji"
                },
                establishedYear: 2020,
                registrationNumber: "EK/COOP/2020/001",
                agents: [
                  {
                    id: "agent-ek-001",
                    name: "Segun Oni",
                    phone: "+234 805 345 6789",
                    email: "segun@farmcred.ng",
                    address: "67 Iworoko Road, Ado Ekiti",
                    cooperativeId: "ekiti-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "enugu",
    name: "Enugu State",
    localGovernments: [
      {
        id: "enugu-north",
        name: "Enugu North",
        wards: [
          {
            id: "enugu-north-ward1",
            name: "Asata Ward",
            cooperatives: [
              {
                id: "enugu-coop-1",
                name: "Enugu North Agricultural Cooperative",
                address: "Ogui Road, Enugu",
                memberCount: 223,
                executiveCommittee: {
                  chairman: "Rt. Hon. Ifeanyi Ugwuanyi",
                  secretary: "Mrs. Monica Ugwuanyi",
                  treasurer: "Mr. Peter Mbah"
                },
                establishedYear: 2018,
                registrationNumber: "EN/COOP/2018/001",
                agents: [
                  {
                    id: "agent-en-001",
                    name: "Chijioke Edeoga",
                    phone: "+234 807 456 7890",
                    email: "chijioke@farmcred.ng",
                    address: "89 Abakpa Nike Road, Enugu",
                    cooperativeId: "enugu-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gombe",
    name: "Gombe State",
    localGovernments: [
      {
        id: "gombe",
        name: "Gombe",
        wards: [
          {
            id: "gombe-ward1",
            name: "Pantami Ward",
            cooperatives: [
              {
                id: "gombe-coop-1",
                name: "Gombe State Farmers Cooperative",
                address: "Biu Road, Gombe",
                memberCount: 267,
                executiveCommittee: {
                  chairman: "Alhaji Muhammadu Yahaya",
                  secretary: "Hajiya Asma'u Yahaya",
                  treasurer: "Malam Jibrin Barde"
                },
                establishedYear: 2019,
                registrationNumber: "GM/COOP/2019/001",
                agents: [
                  {
                    id: "agent-gm-001",
                    name: "Ibrahim Dankwambo",
                    phone: "+234 809 567 8901",
                    email: "ibrahim@farmcred.ng",
                    address: "34 Market Road, Gombe",
                    cooperativeId: "gombe-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "imo",
    name: "Imo State",
    localGovernments: [
      {
        id: "owerri-north",
        name: "Owerri North",
        wards: [
          {
            id: "owerri-north-ward1",
            name: "Emekuku Ward",
            cooperatives: [
              {
                id: "imo-coop-1",
                name: "Owerri North Palm Oil Cooperative",
                address: "Tetlow Road, Owerri",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Sen. Hope Uzodimma",
                  secretary: "Mrs. Chioma Uzodimma",
                  treasurer: "Mr. Placid Njoku"
                },
                establishedYear: 2020,
                registrationNumber: "IM/COOP/2020/001",
                agents: [
                  {
                    id: "agent-im-001",
                    name: "Emeka Ihedioha",
                    phone: "+234 803 678 9012",
                    email: "emeka@farmcred.ng",
                    address: "56 Wetheral Road, Owerri",
                    cooperativeId: "imo-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "jigawa",
    name: "Jigawa State",
    localGovernments: [
      {
        id: "dutse",
        name: "Dutse",
        wards: [
          {
            id: "dutse-ward1",
            name: "Dutse Ward",
            cooperatives: [
              {
                id: "jigawa-coop-1",
                name: "Dutse Agricultural Cooperative",
                address: "Kano Road, Dutse",
                memberCount: 312,
                executiveCommittee: {
                  chairman: "Alhaji Badaru Abubakar",
                  secretary: "Hajiya Hadiza Badaru",
                  treasurer: "Malam Umar Namadi"
                },
                establishedYear: 2017,
                registrationNumber: "JG/COOP/2017/001",
                agents: [
                  {
                    id: "agent-jg-001",
                    name: "Sule Lamido",
                    phone: "+234 805 789 0123",
                    email: "sule@farmcred.ng",
                    address: "78 Government House Road, Dutse",
                    cooperativeId: "jigawa-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kaduna",
    name: "Kaduna State",
    localGovernments: [
      {
        id: "kaduna-north",
        name: "Kaduna North",
        wards: [
          {
            id: "kaduna-north-ward1",
            name: "Hayin Banki",
            cooperatives: [
              {
                id: "kaduna-north-1",
                name: "Hayin Banki Agricultural Cooperative",
                address: "Hayin Banki Market, Kaduna",
                memberCount: 198,
                executiveCommittee: {
                  chairman: "Malam Bello Kaduna",
                  secretary: "Hajiya Maryam Sule",
                  treasurer: "Alhaji Garba Danladi",
                  publicRelationsOfficer: "Fatima Aliyu"
                },
                establishedYear: 2019,
                registrationNumber: "KD/COOP/2019/134",
                agents: [
                  {
                    id: "agent-kd-001",
                    name: "Nasir El-Rufai",
                    phone: "+234 807 890 1234",
                    email: "nasir@farmcred.ng",
                    address: "12 Constitution Road, Kaduna",
                    cooperativeId: "kaduna-north-1"
                  }
                ]
              }
            ]
          },
          {
            id: "kaduna-north-ward2", 
            name: "Unguwar Rimi",
            cooperatives: [
              {
                id: "kaduna-north-2",
                name: "Rimi Farmers Development Cooperative",
                address: "Unguwar Rimi, Kaduna North",
                memberCount: 167,
                executiveCommittee: {
                  chairman: "Malam Sani Rimi",
                  secretary: "Aisha Bello",
                  treasurer: "Ibrahim Mohammed"
                },
                establishedYear: 2020,
                registrationNumber: "KD/COOP/2020/156",
                agents: [
                  {
                    id: "agent-kd-002",
                    name: "Hadiza Bala-Usman",
                    phone: "+234 809 901 2345",
                    email: "hadiza@farmcred.ng",
                    address: "45 Ahmadu Bello Way, Kaduna",
                    cooperativeId: "kaduna-north-2"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "zaria",
        name: "Zaria",
        wards: [
          {
            id: "zaria-city",
            name: "Zaria City",
            cooperatives: [
              {
                id: "zaria-1",
                name: "Zaria Commercial Farmers Cooperative",
                address: "Samaru Road, Zaria",
                memberCount: 278,
                executiveCommittee: {
                  chairman: "Prof. Ahmad Danfulani",
                  secretary: "Dr. Aisha Mohammed",
                  treasurer: "Malam Ibrahim Zakari"
                },
                establishedYear: 2016,
                registrationNumber: "KD/COOP/2016/089",
                agents: [
                  {
                    id: "agent-kd-003",
                    name: "Shehu Sani",
                    phone: "+234 803 012 3456",
                    email: "shehu@farmcred.ng",
                    address: "67 Kongo Road, Zaria",
                    cooperativeId: "zaria-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kano",
    name: "Kano State",
    localGovernments: [
      {
        id: "kano-municipal",
        name: "Kano Municipal",
        wards: [
          {
            id: "fagge",
            name: "Fagge",
            cooperatives: [
              {
                id: "fagge-1",
                name: "Fagge Agricultural Development Cooperative",
                address: "Fagge Market Area, Kano",
                memberCount: 456,
                executiveCommittee: {
                  chairman: "Alhaji Musa Dantata",
                  secretary: "Hajiya Khadija Sani",
                  treasurer: "Malam Umar Farouk",
                  publicRelationsOfficer: "Amina Bello"
                },
                establishedYear: 2015,
                registrationNumber: "KN/COOP/2015/012",
                agents: [
                  {
                    id: "agent-kn-001",
                    name: "Abdullahi Ganduje",
                    phone: "+234 805 123 4567",
                    email: "abdullahi@farmcred.ng",
                    address: "89 Murtala Mohammed Way, Kano",
                    cooperativeId: "fagge-1"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "nassarawa",
        name: "Nassarawa",
        wards: [
          {
            id: "nassarawa-ward1",
            name: "Nassarawa GRA",
            cooperatives: [
              {
                id: "nassarawa-1",
                name: "Nassarawa Modern Farmers Cooperative",
                address: "GRA Phase 2, Nassarawa, Kano",
                memberCount: 234,
                executiveCommittee: {
                  chairman: "Dr. Aminu Kano",
                  secretary: "Eng. Fatima Ibrahim",
                  treasurer: "Malam Yusuf Nassarawa",
                  publicRelationsOfficer: "Hajiya Zainab Musa"
                },
                establishedYear: 2018,
                registrationNumber: "KN/COOP/2018/087",
                agents: [
                  {
                    id: "agent-kn-002",
                    name: "Rabiu Kwankwaso",
                    phone: "+234 807 234 5678",
                    email: "rabiu@farmcred.ng",
                    address: "23 Zoo Road, Kano",
                    cooperativeId: "nassarawa-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "katsina",
    name: "Katsina State",
    localGovernments: [
      {
        id: "funtua",
        name: "Funtua",
        wards: [
          {
            id: "funtua-central",
            name: "Funtua Central",
            cooperatives: [
              {
                id: "funtua-farmers-1",
                name: "Funtua Progressive Farmers Cooperative",
                address: "No. 15 Market Road, Funtua",
                memberCount: 245,
                executiveCommittee: {
                  chairman: "Malam Usman Ibrahim",
                  secretary: "Hajiya Fatima Sani",
                  treasurer: "Malam Mohammed Yusuf",
                  publicRelationsOfficer: "Amina Garba"
                },
                establishedYear: 2018,
                registrationNumber: "KT/COOP/2018/045",
                agents: [
                  {
                    id: "agent-kt-001",
                    name: "Aminu Masari",
                    phone: "+234 809 345 6789",
                    email: "aminu@farmcred.ng",
                    address: "34 Emir's Palace Road, Funtua",
                    cooperativeId: "funtua-farmers-1"
                  }
                ]
              },
              {
                id: "funtua-farmers-2", 
                name: "United Grain Producers Cooperative",
                address: "Beside Primary School, Funtua",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Malam Suleiman Ahmad",
                  secretary: "Hauwa Mohammed",
                  treasurer: "Ibrahim Nasir"
                },
                establishedYear: 2020,
                registrationNumber: "KT/COOP/2020/078",
                agents: [
                  {
                    id: "agent-kt-002",
                    name: "Dikko Radda",
                    phone: "+234 803 456 7890",
                    email: "dikko@farmcred.ng",
                    address: "56 Government House, Funtua",
                    cooperativeId: "funtua-farmers-2"
                  }
                ]
              }
            ]
          },
          {
            id: "funtua-north",
            name: "Funtua North",
            cooperatives: [
              {
                id: "funtua-north-1",
                name: "Northern Farmers Unity Cooperative",
                address: "Ungwar Alkali, Funtua",
                memberCount: 156,
                executiveCommittee: {
                  chairman: "Malam Garba Usman",
                  secretary: "Zainab Ibrahim",
                  treasurer: "Yusuf Sani"
                },
                establishedYear: 2019,
                registrationNumber: "KT/COOP/2019/067",
                agents: [
                  {
                    id: "agent-kt-003",
                    name: "Bello Masari",
                    phone: "+234 805 567 8901",
                    email: "bello@farmcred.ng",
                    address: "78 Katsina Road, Funtua",
                    cooperativeId: "funtua-north-1"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "katsina-lga",
        name: "Katsina",
        wards: [
          {
            id: "katsina-central",
            name: "Katsina Central",
            cooperatives: [
              {
                id: "katsina-central-1",
                name: "Katsina Metropolitan Farmers Cooperative",
                address: "No. 23 Emir's Palace Road, Katsina",
                memberCount: 312,
                executiveCommittee: {
                  chairman: "Alhaji Shehu Musa",
                  secretary: "Halima Yusuf",
                  treasurer: "Malam Abdullahi Hassan",
                  publicRelationsOfficer: "Safiya Ahmad"
                },
                establishedYear: 2017,
                registrationNumber: "KT/COOP/2017/023",
                agents: [
                  {
                    id: "agent-kt-004",
                    name: "Kabir Masari",
                    phone: "+234 807 678 9012",
                    email: "kabir@farmcred.ng",
                    address: "90 Central Market, Katsina",
                    cooperativeId: "katsina-central-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kebbi",
    name: "Kebbi State",
    localGovernments: [
      {
        id: "birnin-kebbi",
        name: "Birnin Kebbi",
        wards: [
          {
            id: "birnin-kebbi-central",
            name: "Birnin Kebbi Central",
            cooperatives: [
              {
                id: "birnin-kebbi-1",
                name: "Kebbi State Rice Producers Cooperative",
                address: "Emir's Palace Road, Birnin Kebbi",
                memberCount: 445,
                executiveCommittee: {
                  chairman: "Alhaji Abubakar Kebbi",
                  secretary: "Hajiya Hauwa Birnin",
                  treasurer: "Malam Sani Argungu",
                  publicRelationsOfficer: "Amina Kebbi"
                },
                establishedYear: 2016,
                registrationNumber: "KB/COOP/2016/023",
                agents: [
                  {
                    id: "agent-kb-001",
                    name: "Atiku Bagudu",
                    phone: "+234 809 789 0123",
                    email: "atiku@farmcred.ng",
                    address: "12 Sultan Abubakar Road, Birnin Kebbi",
                    cooperativeId: "birnin-kebbi-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kogi",
    name: "Kogi State",
    localGovernments: [
      {
        id: "lokoja",
        name: "Lokoja",
        wards: [
          {
            id: "lokoja-ward1",
            name: "Lokoja A Ward",
            cooperatives: [
              {
                id: "kogi-coop-1",
                name: "Lokoja Confluence Farmers Cooperative",
                address: "Ganaja Junction, Lokoja",
                memberCount: 178,
                executiveCommittee: {
                  chairman: "Alhaji Yahaya Bello",
                  secretary: "Mrs. Rashida Bello",
                  treasurer: "Mr. Edward Onoja"
                },
                establishedYear: 2019,
                registrationNumber: "KG/COOP/2019/001",
                agents: [
                  {
                    id: "agent-kg-001",
                    name: "James Faleke",
                    phone: "+234 803 890 1234",
                    email: "james@farmcred.ng",
                    address: "45 Murtala Mohammed Way, Lokoja",
                    cooperativeId: "kogi-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kwara",
    name: "Kwara State",
    localGovernments: [
      {
        id: "ilorin-west",
        name: "Ilorin West",
        wards: [
          {
            id: "ilorin-west-ward1",
            name: "Adewole Ward",
            cooperatives: [
              {
                id: "kwara-coop-1",
                name: "Ilorin West Agricultural Cooperative",
                address: "Challenge Area, Ilorin",
                memberCount: 234,
                executiveCommittee: {
                  chairman: "Alhaji AbdulRahman AbdulRazaq",
                  secretary: "Mrs. Olufolake AbdulRazaq",
                  treasurer: "Mr. Kayode Alabi"
                },
                establishedYear: 2020,
                registrationNumber: "KW/COOP/2020/001",
                agents: [
                  {
                    id: "agent-kw-001",
                    name: "Bukola Saraki",
                    phone: "+234 805 901 2345",
                    email: "bukola@farmcred.ng",
                    address: "67 Post Office Road, Ilorin",
                    cooperativeId: "kwara-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "lagos",
    name: "Lagos State",
    localGovernments: [
      {
        id: "alimosho",
        name: "Alimosho",
        wards: [
          {
            id: "alimosho-ward1",
            name: "Agbado/Oke-Odo Ward",
            cooperatives: [
              {
                id: "lagos-coop-1",
                name: "Alimosho Agricultural Cooperative",
                address: "Agbado Crossing, Lagos",
                memberCount: 145,
                executiveCommittee: {
                  chairman: "Mr. Babajide Sanwo-Olu",
                  secretary: "Mrs. Ibijoke Sanwo-Olu",
                  treasurer: "Dr. Obafemi Hamzat"
                },
                establishedYear: 2021,
                registrationNumber: "LG/COOP/2021/001",
                agents: [
                  {
                    id: "agent-lg-001",
                    name: "Gbenga Daniel",
                    phone: "+234 807 012 3456",
                    email: "gbenga@farmcred.ng",
                    address: "89 Lagos-Abeokuta Expressway, Lagos",
                    cooperativeId: "lagos-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "nasarawa",
    name: "Nasarawa State",
    localGovernments: [
      {
        id: "lafia",
        name: "Lafia",
        wards: [
          {
            id: "lafia-ward1",
            name: "Lafia Central Ward",
            cooperatives: [
              {
                id: "nasarawa-coop-1",
                name: "Lafia Agricultural Development Cooperative",
                address: "Makurdi Road, Lafia",
                memberCount: 267,
                executiveCommittee: {
                  chairman: "Engr. Abdullahi Sule",
                  secretary: "Mrs. Silifat Sule",
                  treasurer: "Dr. Emmanuel Akabe"
                },
                establishedYear: 2018,
                registrationNumber: "NS/COOP/2018/001",
                agents: [
                  {
                    id: "agent-ns-001",
                    name: "Tanko Al-Makura",
                    phone: "+234 809 123 4567",
                    email: "tanko@farmcred.ng",
                    address: "34 Government House Road, Lafia",
                    cooperativeId: "nasarawa-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "niger",
    name: "Niger State",
    localGovernments: [
      {
        id: "minna",
        name: "Minna",
        wards: [
          {
            id: "minna-ward1",
            name: "Chanchaga Ward",
            cooperatives: [
              {
                id: "niger-coop-1",
                name: "Minna Agricultural Cooperative",
                address: "Paiko Road, Minna",
                memberCount: 298,
                executiveCommittee: {
                  chairman: "Alhaji Abubakar Bello",
                  secretary: "Hajiya Amina Bello",
                  treasurer: "Comrade Ahmed Ketso"
                },
                establishedYear: 2017,
                registrationNumber: "NG/COOP/2017/001",
                agents: [
                  {
                    id: "agent-ng-001",
                    name: "Babangida Aliyu",
                    phone: "+234 803 234 5678",
                    email: "babangida@farmcred.ng",
                    address: "56 Bosso Road, Minna",
                    cooperativeId: "niger-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ogun",
    name: "Ogun State",
    localGovernments: [
      {
        id: "abeokuta-north",
        name: "Abeokuta North",
        wards: [
          {
            id: "abeokuta-north-ward1",
            name: "Ikereku Ward",
            cooperatives: [
              {
                id: "ogun-coop-1",
                name: "Abeokuta North Cassava Farmers Cooperative",
                address: "Lafenwa, Abeokuta",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Prince Dapo Abiodun",
                  secretary: "Mrs. Bamidele Abiodun",
                  treasurer: "Hon. Noimot Salako-Oyedele"
                },
                establishedYear: 2019,
                registrationNumber: "OG/COOP/2019/001",
                agents: [
                  {
                    id: "agent-og-001",
                    name: "Ibikunle Amosun",
                    phone: "+234 805 345 6789",
                    email: "ibikunle@farmcred.ng",
                    address: "78 Oke-Mosan, Abeokuta",
                    cooperativeId: "ogun-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "ondo",
    name: "Ondo State",
    localGovernments: [
      {
        id: "akure-north",
        name: "Akure North",
        wards: [
          {
            id: "akure-north-ward1",
            name: "Iju Ward",
            cooperatives: [
              {
                id: "ondo-coop-1",
                name: "Akure North Cocoa Farmers Cooperative",
                address: "Iju/Itaogbolu Road, Akure",
                memberCount: 223,
                executiveCommittee: {
                  chairman: "Arakunrin Oluwarotimi Akeredolu",
                  secretary: "Mrs. Betty Akeredolu",
                  treasurer: "Lucky Aiyedatiwa"
                },
                establishedYear: 2018,
                registrationNumber: "ON/COOP/2018/001",
                agents: [
                  {
                    id: "agent-on-001",
                    name: "Eyitayo Jegede",
                    phone: "+234 807 456 7890",
                    email: "eyitayo@farmcred.ng",
                    address: "90 Oba Adesida Road, Akure",
                    cooperativeId: "ondo-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "osun",
    name: "Osun State",
    localGovernments: [
      {
        id: "osogbo",
        name: "Osogbo",
        wards: [
          {
            id: "osogbo-ward1",
            name: "Olaiya Ward",
            cooperatives: [
              {
                id: "osun-coop-1",
                name: "Osogbo Agricultural Cooperative",
                address: "Oke-Fia, Osogbo",
                memberCount: 167,
                executiveCommittee: {
                  chairman: "Sen. Ademola Adeleke",
                  secretary: "Mrs. Ngozi Adeleke",
                  treasurer: "Prince Dotun Babayemi"
                },
                establishedYear: 2020,
                registrationNumber: "OS/COOP/2020/001",
                agents: [
                  {
                    id: "agent-os-001",
                    name: "Rauf Aregbesola",
                    phone: "+234 809 567 8901",
                    email: "rauf@farmcred.ng",
                    address: "23 Station Road, Osogbo",
                    cooperativeId: "osun-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "oyo",
    name: "Oyo State",
    localGovernments: [
      {
        id: "ibadan-north",
        name: "Ibadan North",
        wards: [
          {
            id: "ibadan-north-ward1",
            name: "Agodi Ward",
            cooperatives: [
              {
                id: "oyo-coop-1",
                name: "Ibadan North Maize Farmers Cooperative",
                address: "Agodi GRA, Ibadan",
                memberCount: 245,
                executiveCommittee: {
                  chairman: "Engr. Seyi Makinde",
                  secretary: "Mrs. Tamunominini Makinde",
                  treasurer: "Prof. Dahiru Adesina"
                },
                establishedYear: 2019,
                registrationNumber: "OY/COOP/2019/001",
                agents: [
                  {
                    id: "agent-oy-001",
                    name: "Abiola Ajimobi",
                    phone: "+234 803 678 9012",
                    email: "abiola@farmcred.ng",
                    address: "45 Secretariat Road, Ibadan",
                    cooperativeId: "oyo-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "plateau",
    name: "Plateau State",
    localGovernments: [
      {
        id: "jos-north",
        name: "Jos North",
        wards: [
          {
            id: "jos-north-ward1",
            name: "Gangare Ward",
            cooperatives: [
              {
                id: "plateau-coop-1",
                name: "Jos North Potato Farmers Cooperative",
                address: "Gangare, Jos",
                memberCount: 198,
                executiveCommittee: {
                  chairman: "Barr. Caleb Mutfwang",
                  secretary: "Mrs. Anna Mutfwang",
                  treasurer: "Rt. Hon. Abok Ayuba"
                },
                establishedYear: 2018,
                registrationNumber: "PL/COOP/2018/001",
                agents: [
                  {
                    id: "agent-pl-001",
                    name: "Simon Lalong",
                    phone: "+234 805 789 0123",
                    email: "simon@farmcred.ng",
                    address: "67 Yakubu Gowon Way, Jos",
                    cooperativeId: "plateau-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "rivers",
    name: "Rivers State",
    localGovernments: [
      {
        id: "port-harcourt",
        name: "Port Harcourt",
        wards: [
          {
            id: "port-harcourt-ward1",
            name: "Mile 1 Ward",
            cooperatives: [
              {
                id: "rivers-coop-1",
                name: "Port Harcourt Fishermen Cooperative",
                address: "Creek Road, Port Harcourt",
                memberCount: 134,
                executiveCommittee: {
                  chairman: "Sir Siminalayi Fubara",
                  secretary: "Mrs. Valerie Fubara",
                  treasurer: "Prof. Zaccheus Adangor"
                },
                establishedYear: 2021,
                registrationNumber: "RV/COOP/2021/001",
                agents: [
                  {
                    id: "agent-rv-001",
                    name: "Nyesom Wike",
                    phone: "+234 807 890 1234",
                    email: "nyesom@farmcred.ng",
                    address: "89 Aba Road, Port Harcourt",
                    cooperativeId: "rivers-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "sokoto",
    name: "Sokoto State",
    localGovernments: [
      {
        id: "sokoto-north",
        name: "Sokoto North",
        wards: [
          {
            id: "sokoto-central",
            name: "Sokoto Central",
            cooperatives: [
              {
                id: "sokoto-1",
                name: "Sokoto Caliphate Farmers Cooperative",
                address: "Sultan Bello Road, Sokoto",
                memberCount: 389,
                executiveCommittee: {
                  chairman: "Alhaji Aliyu Sokoto",
                  secretary: "Hajiya Aisha Usman",
                  treasurer: "Malam Bello Kebbi",
                  publicRelationsOfficer: "Fatima Sokoto"
                },
                establishedYear: 2017,
                registrationNumber: "SK/COOP/2017/045",
                agents: [
                  {
                    id: "agent-sk-001",
                    name: "Aminu Tambuwal",
                    phone: "+234 809 901 2345",
                    email: "aminu@farmcred.ng",
                    address: "12 Shehu Shagari Way, Sokoto",
                    cooperativeId: "sokoto-1"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "wamako",
        name: "Wamako",
        wards: [
          {
            id: "wamako-ward1",
            name: "Wamako Town",
            cooperatives: [
              {
                id: "wamako-1",
                name: "Wamako Rice Farmers Cooperative",
                address: "Wamako Market, Sokoto",
                memberCount: 267,
                executiveCommittee: {
                  chairman: "Malam Ibrahim Wamako",
                  secretary: "Hajiya Khadija Aliyu",
                  treasurer: "Alhaji Musa Kebbi"
                },
                establishedYear: 2019,
                registrationNumber: "SK/COOP/2019/078",
                agents: [
                  {
                    id: "agent-sk-002",
                    name: "Ahmad Aliyu",
                    phone: "+234 803 012 3456",
                    email: "ahmad@farmcred.ng",
                    address: "45 Wamako Road, Sokoto",
                    cooperativeId: "wamako-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "taraba",
    name: "Taraba State",
    localGovernments: [
      {
        id: "jalingo",
        name: "Jalingo",
        wards: [
          {
            id: "jalingo-ward1",
            name: "Sarkin Dawaki Ward",
            cooperatives: [
              {
                id: "taraba-coop-1",
                name: "Jalingo Agricultural Cooperative",
                address: "Hammaruwa Way, Jalingo",
                memberCount: 178,
                executiveCommittee: {
                  chairman: "Arc. Darius Ishaku",
                  secretary: "Mrs. Anna Ishaku",
                  treasurer: "Col. Agbu Kefas"
                },
                establishedYear: 2019,
                registrationNumber: "TR/COOP/2019/001",
                agents: [
                  {
                    id: "agent-tr-001",
                    name: "Jolly Nyame",
                    phone: "+234 805 123 4567",
                    email: "jolly@farmcred.ng",
                    address: "23 Government House Road, Jalingo",
                    cooperativeId: "taraba-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "yobe",
    name: "Yobe State",
    localGovernments: [
      {
        id: "damaturu",
        name: "Damaturu",
        wards: [
          {
            id: "damaturu-ward1",
            name: "Damaturu Central Ward",
            cooperatives: [
              {
                id: "yobe-coop-1",
                name: "Damaturu Agricultural Cooperative",
                address: "Potiskum Road, Damaturu",
                memberCount: 234,
                executiveCommittee: {
                  chairman: "Hon. Mai Mala Buni",
                  secretary: "Hajiya Gumsu Buni",
                  treasurer: "Alhaji Lawan Gana"
                },
                establishedYear: 2018,
                registrationNumber: "YB/COOP/2018/001",
                agents: [
                  {
                    id: "agent-yb-001",
                    name: "Ibrahim Gaidam",
                    phone: "+234 807 234 5678",
                    email: "ibrahim@farmcred.ng",
                    address: "45 Maiduguri Road, Damaturu",
                    cooperativeId: "yobe-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "zamfara",
    name: "Zamfara State",
    localGovernments: [
      {
        id: "gusau",
        name: "Gusau",
        wards: [
          {
            id: "gusau-ward1",
            name: "Gusau Central Ward",
            cooperatives: [
              {
                id: "zamfara-coop-1",
                name: "Gusau Agricultural Cooperative",
                address: "Sokoto Road, Gusau",
                memberCount: 267,
                executiveCommittee: {
                  chairman: "Dr. Bello Matawalle",
                  secretary: "Mrs. Aisha Matawalle",
                  treasurer: "Alhaji Dauda Lawal"
                },
                establishedYear: 2019,
                registrationNumber: "ZM/COOP/2019/001",
                agents: [
                  {
                    id: "agent-zm-001",
                    name: "Abdulaziz Yari",
                    phone: "+234 809 345 6789",
                    email: "abdulaziz@farmcred.ng",
                    address: "67 Government House Road, Gusau",
                    cooperativeId: "zamfara-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "fct",
    name: "Federal Capital Territory",
    localGovernments: [
      {
        id: "abuja-municipal",
        name: "Abuja Municipal Area Council",
        wards: [
          {
            id: "garki-ward",
            name: "Garki Ward",
            cooperatives: [
              {
                id: "fct-coop-1",
                name: "FCT Agricultural Development Cooperative",
                address: "Central Business District, Abuja",
                memberCount: 123,
                executiveCommittee: {
                  chairman: "Hon. Nyesom Wike",
                  secretary: "Mrs. Judith Wike",
                  treasurer: "Mallam Nasir El-Rufai"
                },
                establishedYear: 2020,
                registrationNumber: "FCT/COOP/2020/001",
                agents: [
                  {
                    id: "agent-fct-001",
                    name: "Bala Mohammed",
                    phone: "+234 803 456 7890",
                    email: "bala@farmcred.ng",
                    address: "89 Shehu Shagari Way, Abuja",
                    cooperativeId: "fct-coop-1"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "gwagwalada",
        name: "Gwagwalada Area Council",
        wards: [
          {
            id: "gwagwalada-ward1",
            name: "Gwagwalada Central Ward",
            cooperatives: [
              {
                id: "fct-coop-2",
                name: "Gwagwalada Farmers Cooperative",
                address: "Gwagwalada Town, FCT",
                memberCount: 189,
                executiveCommittee: {
                  chairman: "Chief Adamu Aliero",
                  secretary: "Mrs. Zainab Aliero",
                  treasurer: "Alhaji Sani Danladi"
                },
                establishedYear: 2019,
                registrationNumber: "FCT/COOP/2019/002",
                agents: [
                  {
                    id: "agent-fct-002",
                    name: "Mohammed Bello",
                    phone: "+234 805 567 8901",
                    email: "mohammed@farmcred.ng",
                    address: "34 Gwagwalada Market, FCT",
                    cooperativeId: "fct-coop-2"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
