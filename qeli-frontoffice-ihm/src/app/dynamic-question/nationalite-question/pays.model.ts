/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export enum Pays {
  CH = "ch",
  AF = "af",
  ZA = "za",
  AL = "al",
  DZ = "dz",
  DE = "de",
  AD = "ad",
  AO = "ao",
  AG = "ag",
  SA = "sa",
  AR = "ar",
  AM = "am",
  AU = "au",
  AT = "at",
  AZ = "az",
  BS = "bs",
  BH = "bh",
  BD = "bd",
  BB = "bb",
  BE = "be",
  BZ = "bz",
  BJ = "bj",
  BT = "bt",
  BY = "by",
  MM = "mm",
  BO = "bo",
  BA = "ba",
  BW = "bw",
  BR = "br",
  BN = "bn",
  BG = "bg",
  BF = "bf",
  BI = "bi",
  KH = "kh",
  CM = "cm",
  CA = "ca",
  CV = "cv",
  CL = "cl",
  CN = "cn",
  CY = "cy",
  CO = "co",
  KM = "km",
  CG = "cg",
  CD = "cd",
  KP = "kp",
  KR = "kr",
  CR = "cr",
  CI = "ci",
  HR = "hr",
  CU = "cu",
  DK = "dk",
  DJ = "dj",
  DM = "dm",
  EG = "eg",
  AE = "ae",
  EC = "ec",
  ER = "er",
  ES = "es",
  EE = "ee",
  US = "us",
  ET = "et",
  FJ = "fj",
  FI = "fi",
  FR = "fr",
  GA = "ga",
  GM = "gm",
  GE = "ge",
  GH = "gh",
  GR = "gr",
  GD = "gd",
  GT = "gt",
  GN = "gn",
  GW = "gw",
  GQ = "gq",
  GY = "gy",
  HT = "ht",
  HN = "hn",
  HU = "hu",
  CK = "ck",
  MH = "mh",
  SB = "sb",
  IN = "in",
  ID = "id",
  IQ = "iq",
  IR = "ir",
  IE = "ie",
  IS = "is",
  IL = "il",
  IT = "it",
  JM = "jm",
  JP = "jp",
  JO = "jo",
  KZ = "kz",
  KE = "ke",
  KG = "kg",
  KI = "ki",
  XK = "xk",
  KW = "kw",
  LA = "la",
  LS = "ls",
  LV = "lv",
  LB = "lb",
  LR = "lr",
  LY = "ly",
  LI = "li",
  LT = "lt",
  LU = "lu",
  MK = "mk",
  MG = "mg",
  MY = "my",
  MW = "mw",
  MV = "mv",
  ML = "ml",
  MT = "mt",
  MA = "ma",
  MU = "mu",
  MR = "mr",
  MX = "mx",
  FM = "fm",
  MD = "md",
  MC = "mc",
  MN = "mn",
  ME = "me",
  MZ = "mz",
  NA = "na",
  NR = "nr",
  NP = "np",
  NI = "ni",
  NE = "ne",
  NG = "ng",
  NO = "no",
  NZ = "nz",
  OM = "om",
  UG = "ug",
  UZ = "uz",
  PK = "pk",
  PW = "pw",
  PS = "ps",
  PA = "pa",
  PG = "pg",
  PY = "py",
  NL = "nl",
  PE = "pe",
  PH = "ph",
  PL = "pl",
  PT = "pt",
  QA = "qa",
  CF = "cf",
  DO = "do",
  RO = "ro",
  GB = "gb",
  RU = "ru",
  RW = "rw",
  LC = "lc",
  KN = "kn",
  SM = "sm",
  VC = "vc",
  SV = "sv",
  WS = "ws",
  ST = "st",
  SN = "sn",
  RS = "rs",
  SC = "sc",
  SL = "sl",
  SG = "sg",
  SK = "sk",
  SI = "si",
  SO = "so",
  SD = "sd",
  SS = "ss",
  LK = "lk",
  SE = "se",
  SR = "sr",
  SZ = "sz",
  SY = "sy",
  TJ = "tj",
  TW = "tw",
  TZ = "tz",
  TD = "td",
  CZ = "cz",
  TH = "th",
  TL = "tl",
  TG = "tg",
  TO = "to",
  TT = "tt",
  TN = "tn",
  TM = "tm",
  TR = "tr",
  TV = "tv",
  UA = "ua",
  UY = "uy",
  VU = "vu",
  VA = "va",
  VE = "ve",
  VN = "vn",
  YE = "ye",
  ZM = "zm",
  ZW = "zw"
}

export const PAYS_CONVENTIONNES = [
  Pays.AU, // Australie
  Pays.BA, // Bosnie-Herzégovine
  Pays.BR, // Brésil
  Pays.CA, // Canada
  Pays.CL, // Chili
  Pays.XK, // Kosovo
  Pays.JP, // Japon
  Pays.MK, // Macédoine
  Pays.ME, // Montenegro
  Pays.PH, // Philippines
  Pays.SM, // Saint-Marin
  Pays.RS, // Serbie
  Pays.TR, // Turquie
  Pays.UY, // Uruguay
  Pays.US  // USA
];

export const PAYS_AELE_UE = [
  Pays.DE, // Allemagne
  Pays.AT, // Autriche
  Pays.BE, // Belgique
  Pays.BG, // Bulgarie
  Pays.CY, // Chypre
  Pays.HR, // Croatie
  Pays.DK, // Danemark
  Pays.ES, // Espagne
  Pays.EE, // Estonie
  Pays.FI, // Finlande
  Pays.FR, // France
  Pays.GR, // Grèce
  Pays.HU, // Hongrie
  Pays.IE, // Irlande
  Pays.IS, // Islande
  Pays.IT, // Italie
  Pays.LV, // Lettonie
  Pays.LI, // Liechtenstein
  Pays.LT, // Lituanie
  Pays.LU, // Luxembourg
  Pays.MT, // Malte
  Pays.NO, // Norvège
  Pays.NL, // Pays-Bas
  Pays.PL, // Pologne
  Pays.PT, // Portugal
  Pays.CZ, // République Tchèque
  Pays.RO, // Roumanie
  Pays.GB, // Royaume-Uni
  Pays.SK, // Slovaquie
  Pays.SI, // Slovénie
  Pays.SE  // Suède
];

export const PAYS_NON_CONVENTIONNES = Object.values(Pays).filter(
  pays => (!PAYS_CONVENTIONNES.includes(pays) && !PAYS_AELE_UE.includes(pays) && Pays.CH !== pays)
);
