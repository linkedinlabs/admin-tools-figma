import companies from './data/companies';
import countries from './data/countries';
import degreeBadges from './data/degree-badges';
import domainTLDs from './data/domain-tlds';
import jobTitles from './data/job-titles';
import names from './data/names';
import { getNodeAssignmentData } from './Tools';
import { ASSIGNMENTS } from './constants';

const Generator = require('unique-names-generator');

/**
 * @description Generate a random integer within a range (`min`/`max` inclusive).
 *
 * @kind function
 * @name getRandomInt
 *
 * @param {number} min The minimum number for the range (inclusive).
 * @param {number} max The maximum number for the range (inclusive).
 *
 * @returns {number} The generated number (`randomInt`).
 */
const getRandomInt = (min, max): number => {
  const convertedMin = Math.ceil(min);
  const convertedMax = Math.floor(max);

  // The maximum is inclusive and the minimum is inclusive
  const randomInt: number = Math.floor(
    Math.random() * (convertedMax - convertedMin + 1),
  ) + convertedMin;
  return randomInt;
};

/**
 * @description Generate a random timestamp string from minutes to 6 months. The specific time
 * is formatted based on the length of time using the `timeDeclarations` abbreviation strings.
 *
 * @kind function
 * @name generateTimestamp
 *
 * @returns {string} The formatted timestamp (i.e. “6 mins” or ”18 hrs”).
 */
const generateTimestamp = (): string => {
  const timeDeclarations = ['mins', 'hrs', 'd', 'w', 'mo'];

  let randomTimeInteger = 0;
  const randomTimeDeclarationIndex = Math.floor(Math.random() * timeDeclarations.length);
  const randomTimeDeclaration = timeDeclarations[randomTimeDeclarationIndex];

  switch (randomTimeDeclaration) {
    case 'mins':
      randomTimeInteger = getRandomInt(1, 59);
      break;
    case 'hrs':
      randomTimeInteger = getRandomInt(1, 23);
      break;
    case 'd':
      randomTimeInteger = getRandomInt(1, 6);
      break;
    case 'w':
      randomTimeInteger = getRandomInt(1, 4);
      break;
    case 'mo':
      randomTimeInteger = getRandomInt(1, 6);
      break;
    default:
      return null;
  }

  const generatedStamp = `${randomTimeInteger} ${randomTimeDeclaration}`;
  return generatedStamp;
};

/**
 * @description Generates a formatted, random date between now and `120` days in the future (set
 * as a constant in the function. Dates are formatted using the abbreviations in the
 * `formattedMonths` constant (i.e. “Jan 30, 2022”).
 *
 * @kind function
 * @name generateDate
 *
 * @returns {string} The formatted date as a string.
 */
const generateDate = (): string => {
  // set the upper bound for the random date
  const daysAhead = 120;
  const currentDate: Date = new Date();

  // returns a new date based on the `date` and number of `days` ahead
  const addDaysToDate = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    return newDate;
  };

  // returns a random date between the supplied `startDate` and the `days` ahead
  const randomDate = (startDate: Date, days: number) => {
    const endDate = addDaysToDate(currentDate, days);
    const selectedDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    return selectedDate;
  };

  // month abbreviations list
  const formattedMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // pick a random date between now and the `daysAhead` upper bound
  const date: Date = randomDate(currentDate, daysAhead);

  // format the date for presentation
  const formattedMonth: string = formattedMonths[date.getMonth()];
  const formattedDate: number = date.getDate();
  const formattedYear: number = date.getFullYear();
  const generatedDate: string = `${formattedMonth} ${formattedDate} ${formattedYear}`;

  return generatedDate;
};

/**
 * @description Generates a formatted, random domain name using the `companies` dataset.
 * The TLD is randomized, but weighted toward “.com” primarily, and then “.org”/“.net”
 * before picking from the `domainTLDs` dataset.
 *
 * @kind function
 * @name generateEmail
 *
 * @returns {string} The formatted date as a string.
 */
const generateDomain = (): string => {
  const { uniqueNamesGenerator } = Generator;

  let randomTLD = 'com';
  const weightedTLDPick = getRandomInt(1, 8);
  switch (weightedTLDPick) {
    case 5:
    case 6:
      randomTLD = 'org';
      break;
    case 7:
      randomTLD = 'net';
      break;
    case 8:
      randomTLD = uniqueNamesGenerator({
        dictionaries: [domainTLDs],
        length: 1,
        style: 'lowerCase',
      });
      break;
    default:
      randomTLD = 'com';
  }

  const randomCompany = uniqueNamesGenerator({
    dictionaries: [companies],
    length: 1,
  });

  const generatedDomain = `${randomCompany}.${randomTLD}`;
  return generatedDomain;
};

/**
 * @description Generates a formatted, random email. The domain name is generated by the
 * `generateDomain` function, and the name is pulled and formatted from the `names` dataset.
 *
 * @kind function
 * @name generateEmail
 *
 * @returns {string} The formatted date as a string.
 */
const generateEmail = (): string => {
  const { uniqueNamesGenerator } = Generator;
  const emailSeparators = ['.', '_'];
  const emailSeparatorIndex = getRandomInt(0, 1);

  const randomSeparator = emailSeparators[emailSeparatorIndex];

  const randomNameLength = getRandomInt(1, 2);
  const randomName = uniqueNamesGenerator({
    dictionaries: [names, names],
    length: randomNameLength,
    separator: randomSeparator,
    style: 'lowerCase',
  }).replace(' ', randomSeparator);

  const generatedEmail = `${randomName}@${generateDomain()}`;
  return generatedEmail;
};

/**
 * @description Generates a the filepath to a random image, based on assignment
 * (company or person).
 *
 * @kind function
 * @name generateFilepath
 *
 * @param {string} assignment The assignment used to generate a random filepath.
 *
 * @returns {string} The root filepath with filename.
 */
const generateFilepath = (assignment: 'avatar-company' | 'avatar-person'): string => {
  const { uniqueNamesGenerator } = Generator;
  let filepath = null;

  // company images are named the same as the company names, but
  // set to lowercase – spaces are replaced with hyphens
  if (assignment === ASSIGNMENTS.avatarCompany.id) {
    const randomCompany = uniqueNamesGenerator({
      dictionaries: [companies],
      length: 1,
      style: 'lowerCase',
    }).replace(' ', '-');

    filepath = `/companies/${randomCompany}.png`;
  }

  // first flip a coin betweena “woman” and “man”,
  // then pick a random image for the chosen grouping.
  // image sets for each group currently stop at 35.
  if (assignment === ASSIGNMENTS.avatarPerson.id) {
    const num = getRandomInt(0, 1);
    const randomSex: string = num === 0 ? 'woman' : 'man';
    const randomNumber: number = getRandomInt(1, 35);
    const formattedNumber: string = randomNumber < 10 ? `0${randomNumber}` : `${randomNumber}`;

    filepath = `/people/${randomSex}-${formattedNumber}.png`;
  }

  return filepath;
};

/**
 * @description Generates a random string based on the supplied `assignment`. In most cases
 * the assignment dictates the dictionaries that are loaded and the `uniqueNamesGenerator`
 * package generates the string. In other cases the random string is generated by another
 * helper function.
 *
 * @kind function
 * @name generateRandom
 *
 * @param {string} assignment The string containing the message to be logged.
 *
 * @returns {string} The random string, based on supplied `assignment`.
 */
const generateRandom = (assignment): string => {
  const { uniqueNamesGenerator } = Generator;
  const dictionaries = [];
  let style: 'lowerCase' | 'upperCase' | 'capital' = 'capital';
  let separator: string = null;
  let length: number = 1;
  let newRandomString = null;

  switch (assignment) {
    case ASSIGNMENTS.avatarCompany.id:
    case ASSIGNMENTS.avatarPerson.id: {
      const filepath = [generateFilepath(assignment)];
      dictionaries.push(filepath);
      style = 'lowerCase';
      break;
    }
    case ASSIGNMENTS.company.id:
      dictionaries.push(companies);
      break;
    case ASSIGNMENTS.country.id:
      dictionaries.push(countries);
      break;
    case ASSIGNMENTS.date.id: {
      const date = [generateDate()];
      dictionaries.push(date);
      break;
    }
    case ASSIGNMENTS.degreeBadge.id:
      dictionaries.push(degreeBadges);
      break;
    case ASSIGNMENTS.domain.id: {
      const domain = [generateDomain()];
      dictionaries.push(domain);
      style = 'lowerCase';
      break;
    }
    case ASSIGNMENTS.email.id: {
      const email = [generateEmail()];
      dictionaries.push(email);
      style = 'lowerCase';
      break;
    }
    case ASSIGNMENTS.jobTitle.id:
      dictionaries.push(jobTitles);
      break;
    case ASSIGNMENTS.name.id: {
      // names, twice for a first/last
      dictionaries.push(names);
      dictionaries.push(names);
      separator = ' ';
      length = 2;
      break;
    }
    case ASSIGNMENTS.timestamp.id: {
      const timestamp = [generateTimestamp()];
      dictionaries.push(timestamp);
      break;
    }
    default:
      return newRandomString;
  }

  // generate the random text
  newRandomString = uniqueNamesGenerator({
    dictionaries,
    length,
    separator,
    style,
  });

  return newRandomString;
};

/**
 * @description Manages the interface between the data sets and text nodes. Randomizes data
 * for a node’s `proposedText` through helper functions that generate the data or randomly
 * select from the supplied data sets.
 *
 * @class
 * @name Data
 *
 * @constructor
 *
 * @property event The encompassing event we are logging or applying a message/alert to.
 * @property page The Figma file that will display messages/alerts
 * or that the log will reference.
 */
export default class Data {
  textNode: TextNode;

  constructor({
    for: textNode,
  }) {
    this.textNode = textNode;
  }

  /**
   * @description Generates a random string based on an assigned type. The type may be supplied
   * directly (`forcedAssignment`) or retrieved from the node data using the
   * `getNodeAssignmentData` helper.
   *
   * @kind function
   * @name randomContent
   *
   * @param {string} forcedAssignment The string containing the message to be logged.
   *
   * @returns {string} The random string based on an assigned type.
   */
  randomContent(forcedAssignment?: string) {
    let assignment: string = forcedAssignment;
    let randomContent: string = null;
    if (!forcedAssignment) {
      const assignmentData = getNodeAssignmentData(this.textNode);
      assignment = JSON.parse(assignmentData || null);
    }

    if (assignment) {
      randomContent = generateRandom(assignment);
    }

    return randomContent;
  }
}
