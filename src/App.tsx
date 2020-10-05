import React, { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios';

function App() {
  const exchangeEndpoint = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_ACCESS_KEY}/latest/USD`

  const [input, setInput] = useState<string[]>([])
  const [expected, setExpected] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [exValues, setExValues] = useState<any>({})
  const [exRules, setExRules] = useState(false)
  const [openExchange, setOpenExchange] = useState(false);

  useEffect(() => {
    const estimate = input.join('')
    let product;

    try {
      if (estimate.includes('√') && input.length > 1) {
        // eslint-disable-next-line
        product = Math.sqrt(eval(estimate
          .replace(/√/ig, '')
          .replace(/x/ig, '*')
          .replace(/%/ig, '*.01')
        ))
      }
      else {
        // eslint-disable-next-line
        product = eval(estimate.replace(/x/ig, '*').replace(/%/ig, '*.01')).toString()
      }
      setExpected(product)
    }
    catch {
      setExpected(estimate)
    }
    return () => setExpected('')
  }, [setExpected, input])

  useEffect(() => {
    (async () => {
      const exchangeRates = await axios.get(exchangeEndpoint)
      if (exchangeRates && exchangeRates.data.conversion_rates) {
        const rates = {
        JPY: Math.round(exchangeRates.data.conversion_rates.JPY * 100) / 100,
        HKD: Math.round(exchangeRates.data.conversion_rates.HKD * 100) / 100,
        KRW: Math.round(exchangeRates.data.conversion_rates.KRW * 100) / 100,
        EUR: Math.round(exchangeRates.data.conversion_rates.EUR * 100) / 100,
        AUD: Math.round(exchangeRates.data.conversion_rates.AUD * 100) / 100,
        CAD: Math.round(exchangeRates.data.conversion_rates.CAD * 100) / 100,
        MXN: Math.round(exchangeRates.data.conversion_rates.MXN * 100) / 100,
        GBP: Math.round(exchangeRates.data.conversion_rates.GBP * 100) / 100,
        TWD: Math.round(exchangeRates.data.conversion_rates.TWD * 100) / 100,
        CNY: Math.round(exchangeRates.data.conversion_rates.CNY * 100) / 100,
        SGD: Math.round(exchangeRates.data.conversion_rates.SGD * 100) / 100,
        INR: Math.round(exchangeRates.data.conversion_rates.INR * 100) / 100,
        NZD: Math.round(exchangeRates.data.conversion_rates.NZD * 100) / 100,
        CHF: Math.round(exchangeRates.data.conversion_rates.CHF * 100) / 100
        }
        setExValues(rates)
      }
    })()
  }, [exchangeEndpoint, setExValues])

  const handleInput = (symbol: string) => {
    let inputArray = [...input]

    if (symbol === '=') {
      if (exRules) {
        let fixed = (Math.round(parseFloat(expected) * 100) / 100).toString();
        setExpected(fixed);
        setOutput(fixed);
        setInput([fixed])
        setExRules(false);
      }
      else {
        setOutput(expected);
        setInput([expected])
      }
    }
    else {
      if (symbol === 'AC') {
        inputArray = []
        setOutput('')
      }
      else if (symbol === 'DEL') {
        inputArray.pop()
      }
      else {
        inputArray.push(symbol)
      }
      setInput(inputArray)
    }
  }

  const handleExchange = (symbol: any) => {
    const currency = exValues[symbol].toString();
    let inputArray = [...input, currency]
    setExRules(true)
    setInput(inputArray)
  }

  return (
    <div className="App">
      <h1>Number Tool</h1>
      <main className="pad">
        <article className="main_pad">
          <section className="main_pad__reader">
            <div className="main_pad__reader__output input">{ input.join(' ') }</div>
            <div className="main_pad__reader__output expected">{ expected }</div>
            <div className="main_pad__reader__output">{ output }</div>
          </section>
          <Buttonpad handleInput={handleInput}/>
          <div className="button_pad__row slider">
            <Slider setOpen={setOpenExchange} open={openExchange}>Exchange Rate Options</Slider>
          </div>
        </article>
        <article className={openExchange ? "exchange_pad open":
        "exchange_pad closed"}>
          <h2>USD</h2>
          <div className="exchange_pad__column">
            <ExchangeButton action={handleExchange} symbol={'JPY'} signifier={''} popup={'Japan Yen'}>JPY</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'HKD'} signifier={''} popup={'Hong Kong Dollar'}>HKD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'KRW'} signifier={''} popup={'Korea Won'}>KRW</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'TWD'} signifier={''} popup={'Taiwan Dollar'}>TWD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'CNY'} signifier={''} popup={'China Yuan'}>CNY</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'SGD'} signifier={''} popup={'Singapore Dollar'}>SGD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'EUR'} signifier={''} popup={'Euro'}>EUR</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'GBP'} signifier={''} popup={'England Pound'}>GBP</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'AUD'} signifier={''} popup={'Australia Dollar'}>AUD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'NZD'} signifier={''} popup={'New Zealand Dollar'}>NZD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'CAD'} signifier={''} popup={'Canada Dollar'}>CAD</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'CHF'} signifier={''} popup={'Switzerland Franc'}>CHF</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'MXN'} signifier={''} popup={'Mexico Peso'}>MXN</ExchangeButton>
            <ExchangeButton action={handleExchange} symbol={'INR'} signifier={''} popup={'India Rupee'}>INR</ExchangeButton>
          </div>
        </article>
      </main>
    </div>
  );
}

const Buttonpad = ({handleInput}: {handleInput: (symbol: string) => void}) => {

  return (
    <section className="button_pad">
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'7'} signifier={''}>7</Button>
        <Button action={handleInput} symbol={'8'} signifier={''}>8</Button>
        <Button action={handleInput} symbol={'9'} signifier={''}>9</Button>
        <Button action={handleInput} symbol={'/'} signifier={'operator'}>/</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'4'} signifier={''}>4</Button>
        <Button action={handleInput} symbol={'5'} signifier={''}>5</Button>
        <Button action={handleInput} symbol={'6'} signifier={''}>6</Button>
        <Button action={handleInput} symbol={'x'} signifier={'operator'}>x</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'1'} signifier={''}>1</Button>
        <Button action={handleInput} symbol={'2'} signifier={''}>2</Button>
        <Button action={handleInput} symbol={'3'} signifier={''}>3</Button>
        <Button action={handleInput} symbol={'-'} signifier={'operator'}>-</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'.'} signifier={''}>.</Button>
        <Button action={handleInput} symbol={'0'} signifier={''}>0</Button>
        <Button action={handleInput} symbol={'√'} signifier={''}>√</Button>
        <Button action={handleInput} symbol={'+'} signifier={'operator'}>+</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'AC'} signifier={'special'}>AC</Button>
        <Button action={handleInput} symbol={'DEL'} signifier={'special'}>DEL</Button>
        <Button action={handleInput} symbol={'%'} signifier={''}>%</Button>
        <Button action={handleInput} symbol={'='} signifier={'special'}>=</Button>
      </div>
    </section>
  )
}

const Button = (props: any) => {
  const { action, symbol, signifier } = props
  const [pressed, setPressed] = useState(false)

  return (
    <div className={pressed ? `button ${signifier} pressed`:`button ${signifier}`} 
      onClick={() => action(symbol)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {props.children}
    </div>
  )
}

const ExchangeButton = (props: any) => {
  const { action, symbol, signifier, popup } = props
  const [pressed, setPressed] = useState(false)

  const words = popup.split(' ')
  const countryWord = words.slice(0, words.length - 1).join(' ')
  const currencyWord = words[words.length - 1]

  return (
    <div className={pressed ? `button ${signifier} pressed`:`button ${signifier}`} 
      onClick={() => action(symbol)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <span className="button__popup"><strong>{countryWord} </strong>{currencyWord}</span>
      {props.children}
    </div>
  )
}

const Slider = (props: any) => {
  const { setOpen, open } = props
  const [pressed, setPressed] = useState(false)

  return (
    <div className={pressed ? "slider pressed":"slider unpressed"} 
      onClick={() => setOpen(!open)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {props.children}
    </div>
  )
}

export default App;
