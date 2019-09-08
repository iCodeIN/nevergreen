import React, {useState} from 'react'
import styles from './locally.scss'
import {PrimaryButton} from '../../../common/forms/Button'
import {iFloppyDisk} from '../../../common/fonts/Icons'
import {Configuration, toConfiguration} from '../../../configuration/Configuration'
import {isEmpty} from 'lodash'
import {Messages, MessagesType} from '../../../common/Messages'
import {isBlank} from '../../../common/Utils'
import {useDispatch} from 'react-redux'
import {setConfiguration} from '../../../NevergreenActionCreators'

const PLACEHOLDER = 'paste exported configuration here and press import'

export function Locally() {
  const dispatch = useDispatch()
  const [messages, setMessages] = useState<ReadonlyArray<string>>([])
  const [messageType, setMessageType] = useState(MessagesType.INFO)
  const [data, setData] = useState('')

  const setErrors = (errors: ReadonlyArray<string>) => {
    setMessageType(MessagesType.ERROR)
    setMessages(errors)
  }

  const setInfos = (infos: ReadonlyArray<string>) => {
    setMessageType(MessagesType.INFO)
    setMessages(infos)
  }

  const doImport = () => {
    if (isBlank(data)) {
      setErrors(['Please enter the configuration to import'])
    } else {
      const [dataErrors, configuration] = toConfiguration(data)
      if (isEmpty(dataErrors)) {
        setInfos(['Successfully imported configuration'])
        dispatch(setConfiguration(configuration as Configuration))
        setData('')
      } else {
        setErrors(dataErrors)
      }
    }
  }

  return (
    <>
      <label>
        <span className={styles.label}>configuration to import</span>
        <textarea className={styles.data}
                  placeholder={PLACEHOLDER}
                  value={data}
                  onChange={({target}) => setData(target.value)}
                  spellCheck={false}
                  data-locator='import-data'/>
      </label>
      <PrimaryButton className={styles.import}
                     onClick={doImport}
                     data-locator='import'
                     icon={iFloppyDisk}>
        import
      </PrimaryButton>
      <Messages type={messageType}
                messages={messages}
                data-locator='messages'/>
    </>
  )
}
