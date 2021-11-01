import axios from 'axios'

export async function getUserCountry() {
    console.log(import.meta)
    try {
        const userCountry = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_GEOLOC_API_KEY}`)
        return userCountry.data?.country_code2.toLowerCase() || ''
    } catch(e) {
        console.warn('Cannot get user\'s country.', e)
    }
}