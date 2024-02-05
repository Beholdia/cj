import { Button, Overlay } from 'vant'

const vantList = [Button, Overlay]
const install = (app) => {
  for (let item of vantList) {
    app.use(item)
  }
}
export default { install }
