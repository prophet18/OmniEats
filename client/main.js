const URL = 'http://localhost:3000'

const address = '4710 Norrell Drive, Trussville, AL 35173';
const name = 'Barrel';

try {
    const response = await fetch(`${URL}/business/:${address}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);
} catch (error) {
    console.error('Error submitting transaction:', error);
}