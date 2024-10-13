const generatedNumbers = new Set();

function generateUnique10DigitNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 90000) + 10000;
    } while (generatedNumbers.has(number));
    
    generatedNumbers.add(number);
    return number;
}

export default generateUnique10DigitNumber;
