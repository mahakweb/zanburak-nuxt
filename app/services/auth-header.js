export default function authHeader() {
    // let user = JSON.parse(localStorage.getItem('user'));
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
        return { Authorization: 'Bearer ' + token };
    } else {
        return {};
    }
}