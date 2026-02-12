import { takeEvery } from 'redux-saga/effects'
import { COMMON_ACTION_TYPES } from '../../utilities/constants'
import { handleAlertWithAutoClear } from '../../utilities/helpers'

function* alertSaga() {
  yield takeEvery(
    (action: { type: string }) => action.type.endsWith(COMMON_ACTION_TYPES.SET_ALERT_REQ),
    handleAlertWithAutoClear
  )
}

export default alertSaga
