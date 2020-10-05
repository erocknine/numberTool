import React, { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios';

function App() {
  const exchangeEndpoint = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_ACCESS_KEY}/latest/USD`

  const [input, setInput] = useState<string[]>([])
  const [expected, setExpected] = useState<string>('')
  const [output, setOutput] = useState<string>('0')
  const [exValues, setExValues] = useState<any>({})
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
        product = eval(estimate.replace(/x/ig, '*').replace(/%/ig, '*.01'))
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
      setOutput(expected)
    }
    else {
      if (symbol === 'AC') {
        inputArray = []
        setOutput('0')
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
            <Button action={handleExchange} symbol={'JPY'}>JPY</Button>
            <Button action={handleExchange} symbol={'HKD'}>HKD</Button>
            <Button action={handleExchange} symbol={'KRW'}>KRW</Button>
            <Button action={handleExchange} symbol={'EUR'}>EUR</Button>
            <Button action={handleExchange} symbol={'GBP'}>GBP</Button>
            <Button action={handleExchange} symbol={'AUD'}>AUD</Button>
            <Button action={handleExchange} symbol={'CAD'}>CAD</Button>
            <Button action={handleExchange} symbol={'TWD'}>TWD</Button>
            <Button action={handleExchange} symbol={'CNY'}>CNY</Button>
            <Button action={handleExchange} symbol={'SGD'}>SGD</Button>
            <Button action={handleExchange} symbol={'MXN'}>MXN</Button>
            <Button action={handleExchange} symbol={'INR'}>INR</Button>
            <Button action={handleExchange} symbol={'NZD'}>NZD</Button>
            <Button action={handleExchange} symbol={'CHF'}>CHF</Button>
        </article>
      </main>
    </div>
  );
}

const Buttonpad = ({handleInput}: {handleInput: (symbol: string) => void}) => {

  return (
    <section className="button_pad">
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'AC'}>AC</Button>
        <Button action={handleInput} symbol={'DEL'}>DEL</Button>
        <Button action={handleInput} symbol={'%'}>%</Button>
        <Button action={handleInput} symbol={'/'}>/</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'7'}>7</Button>
        <Button action={handleInput} symbol={'8'}>8</Button>
        <Button action={handleInput} symbol={'9'}>9</Button>
        <Button action={handleInput} symbol={'x'}>x</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'4'}>4</Button>
        <Button action={handleInput} symbol={'5'}>5</Button>
        <Button action={handleInput} symbol={'6'}>6</Button>
        <Button action={handleInput} symbol={'-'}>-</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'1'}>1</Button>
        <Button action={handleInput} symbol={'2'}>2</Button>
        <Button action={handleInput} symbol={'3'}>3</Button>
        <Button action={handleInput} symbol={'+'}>+</Button>
      </div>
      <div className="button_pad__row">
        <Button action={handleInput} symbol={'.'}>.</Button>
        <Button action={handleInput} symbol={'0'}>0</Button>
        <Button action={handleInput} symbol={'√'}>√</Button>
        <Button action={handleInput} symbol={'='}>=</Button>
      </div>
    </section>
  )
}

const Button = (props: any) => {
  const { action, symbol } = props
  const [pressed, setPressed] = useState(false)

  return (
    <div className={pressed ? "button pressed":"button unpressed"} 
      onClick={() => action(symbol)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
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
