import React, { FC, useState } from 'react';


export interface ApiInput {
  name : string
  value : string,
  key : string
}

export function DefaultApiInput(){
  return {
    name : '',
    value : '',
    key : Date.now().toString()
  }
}

type InputFields = 'name' | 'value';

export interface ApiInputs {
  [name:string] : string
}

export interface InputListProps {
  inputs : ApiInput[]
  setInputs : React.Dispatch<React.SetStateAction<ApiInput[]>>
}

export const InputList:FC<InputListProps> = ({ inputs, setInputs }) => {

  function addInput(){
    const newInputs = inputs.slice();
    newInputs.push(DefaultApiInput());
    setInputs(newInputs);
  }

  function removeInput(removeIndex:number){
    const newInputs = inputs.filter((input, index) => index !== removeIndex)
    setInputs(newInputs)
  }

  function updateInput(index:number, field:InputFields, newVal:string){
    const newInputs = inputs.slice();
    newInputs[index][field] = newVal;
    setInputs(newInputs);
  }

  function updaterFactory(index:number, field:InputFields){
    return (e:React.ChangeEvent<HTMLInputElement>) => { updateInput(index, field, e.currentTarget.value) }
  }
  
  return (
    <>
    <h4>JSON Body</h4>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>
            <button onClick={()=>{addInput()}}> <span style={{fontWeight:'bolder'}}>+</span></button>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          inputs.map(({ name, value, key }, index) => (
            <tr key={key}>
              <td>
                <input value={name} name={`input-${index}-name`} onChange={updaterFactory(index, 'name')} />
              </td>
              <td>
                <input value={value} name={`input-${index}-value`} onChange={updaterFactory(index, 'value')} />
              </td>
              <td>
              <button onClick={()=>{removeInput(index)}}>X</button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
    </>
  )
}

export default InputList;