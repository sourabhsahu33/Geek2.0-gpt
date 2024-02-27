

const submitButton = document.querySelector('#submit');
const outPutdocument = document.querySelector('#output');
const inputElement = document.querySelector('input');
const historyElement = document.querySelector('.history');
const buttonElement = document.querySelector('button');

function changeInput(value) {
    const inputElement = document.querySelector('input');
    inputElement.value = value;
}

async function getMessage() {
    console.log('Clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Hello!"
                }
            ],
            max_tokens: 100
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.choices && data.choices.length > 0) {
            const outputContent = data.choices[0].message.content;
            outPutdocument.textContent = outputContent;

            if (outputContent && inputElement.value) {
                const pElement = document.createElement('p');
                pElement.textContent = inputElement.value;
                pElement.addEventListener('click', () => changeInput(pElement.textContent));
                historyElement.append(pElement);
            }
        } else {
            throw new Error('Invalid response format from OpenAI API');
        }
    } catch (error) {
        console.error(error);

        if (error.message.includes("insufficient_quota")) {
            outPutdocument.textContent = "You've exceeded your API quota. Please check your plan and billing details.";
        } else {
            outPutdocument.textContent = "An error occurred while processing your request. Please try again later.";
        }
    }
}

submitButton.addEventListener('click', getMessage);

function clearInput() {
    inputElement.value = '';
}

buttonElement.addEventListener('click', clearInput);
