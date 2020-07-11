console.log(getRandomNumber(1, '100'))

function alertRandom() {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  alert(randomNumber);
}

function getRandomNumber(lower, upper) {
  if (isNaN(lower) || isNaN(upper)) {
    throw Error('Both arguments must be numbers.');
  } else {
    return Math.floor(Math.random() * (upper - lower + 1)) * lower;
  }
}

const student = {
  name: "Quicy",
  grades: [85, 90, 95, 100]
};

const person = {
  name: 'Edward',
  city: 'New York',
  age: 37,
  isStudent: true,
  skill: ['JavaScript', 'html', 'Python']
};

const message = `Hi, I'm ${person.name}. I live in ${person.city}`
const skillsExample =  `I have ${person.skill.length} skills: ${person.skill.join(', ')}`
console.log(message);
console.log(skillsExample);

// for (let key in student) {
//   console.log(key)
//   console.log(student[propName])
// }

for (let prop in person) {
  console.log(`${prop}: ${person[prop]}`)
}

// const person = {
    //...name,
    //...role
//}

//array of objects
// []{question: 'How many planets are in the solar system', answer: '9'}]
