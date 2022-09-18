/**
 * Created with WY
 * Date: 2018/9/23
 * Time: 20:52
 *
 */
import axios from 'axios'
import qs from 'qs'

const BASE_URL = ''
export default {
  sendMessage(logMessage) {
    let BASE_URL = ''
    if (process.env.NODE_ENV === 'production') {
      BASE_URL = ''
    } else {
      BASE_URL = '/api'
    }
    axios.post(BASE_URL + '/log/insert', qs.stringify(logMessage))
      .then(function (response) {
        // console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  changeFontSize() {
    return 14;
  },
  BASE_URL,
}
