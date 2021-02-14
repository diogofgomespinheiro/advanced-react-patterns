import * as React from 'react'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const toggleActionTypes = {
  TOGGLE: 'TOGGLE',
  RESET: 'RESET',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case toggleActionTypes.TOGGLE: {
      return {on: !state.on}
    }
    case toggleActionTypes.RESET: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: toggleActionTypes.TOGGLE})
  const reset = () => dispatch({type: toggleActionTypes.RESET, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

export {useToggle, toggleReducer, toggleActionTypes}
