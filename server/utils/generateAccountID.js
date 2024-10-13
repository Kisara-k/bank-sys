const generatedNumbers = new Set();

function generateUnique8DigitNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 90000000) + 10000000;
    } while (generatedNumbers.has(number));
    
    generatedNumbers.add(number);
    return number;
}

export default generateUnique8DigitNumber;
