import { Button, Overlay, Dialog, Field } from 'vant'

const vantList = [Button, Overlay, Dialog, Field]
const install = (app) => {
  for (let item of vantList) {
    app.use(item)
  }
}
export default { install }
