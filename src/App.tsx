import React, { FC, useState } from 'react';
import request from 'request-promise-native';
import './App.css';
import InputList, { ApiInputs, ApiInput, DefaultApiInput } from './InputList';
import JSONTree from 'react-json-tree';

interface AppProps {

}

console.log('Minor change in App.tsx');

function inputSetterFactory(setter: React.Dispatch<React.SetStateAction<any>>) {
  return (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.currentTarget.value) }
}

const App: FC<AppProps> = (props) => {

  const [endpoint, setEndpoint] = useState('https://authbot.eximchain-dev.com/v1/auth/login');
  const [verb, setVerb] = useState('POST');
  const [result, setResult] = useState('');
  const [token, setToken] = useState('');
  const [inputs, setInputs] = useState([{
    name: 'username',
    value: 'john@eximchain.com',
    key: Date.now().toString()
  }, {
    name: 'password',
    value: 'SuperSecret',
    key: (Date.now() + 1).toString()
  }] as ApiInput[]);

  function getRequestParams() {
    let requestParams = {
      uri: endpoint,
      method: verb,
      json: true,
      // withCredentials: true,
      body: inputs.reduce((body, apiInput) => {
        body[apiInput.name] = apiInput.value;
        return body;
      }, {} as ApiInputs)
    } as request.OptionsWithUri;
    if (token !== '') {
      requestParams.headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }
    }
    return requestParams;
  }

  async function sendCall() {
    console.log('Made call');
    let newResult;
    try {
      let requestParams = getRequestParams();
      console.log('calling w/ params: ', requestParams);
      newResult = await request(requestParams)
      console.log('successful newResult :', newResult);
    } catch (e) {
      console.log('failed call: ', e);
      newResult = e.toString();
    }
    setResult(newResult);
  }

  return (
    <div className="App grid" id='App'>
      <header className="row">
        <div className='column'>
          <h1>API Tester</h1>
          <div className='divider' />
        </div>
      </header>
      <div className='row'>
        <div className='column'>
          <div className='AppBody item' id='AppBody'>
            <h2>API Input</h2>
            <div>
              <h4>Verb</h4>
              <input name='verb' value={verb} onChange={inputSetterFactory(setVerb)} />
            </div>
            <div>
              <h4>Endpoint</h4>
              <input name='endpoint' value={endpoint} onChange={inputSetterFactory(setEndpoint)} />
            </div>
            <div>
              <h4>Auth Token</h4>
              <input name='authToken' value={token} onChange={inputSetterFactory(setToken)} />
            </div>
            <div>
              <InputList inputs={inputs} setInputs={setInputs} />
            </div>
            <div>
              <button onClick={sendCall}>Send Call</button>
            </div>
          </div>
        </div>
        <div className='column'>
          <div>
            <h2>API Call</h2>
            <code><pre>
              request({JSON.stringify(getRequestParams(), null, 2)
              })</pre>
          </code>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='column'>
          <h2>API Result</h2>
          <JSONTree data={result} />
        </div>
      </div>
    </div>
  );
}

export default App;
