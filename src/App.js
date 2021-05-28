import './App.scss';
import {getTransactions} from './App.service';
import { useState, useEffect } from 'react';

const App = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Load data from page 1 on init
    getTransactions(1).then(data => {
      // Set page, count and transactions state
      setPage(data.page);
      setTotalCount(data.totalCount);
      setTransactions(data.transactions);
    });
  }, []);

  /* Data format methods */
  const formatAmount = (amt) => {
    // Formating for 39644.654654 -> 39644.65 using absolute value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amt));
  }

  const formatDay = (d) => {
    // Adding st, nd, rd, th to day 
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  /* Data format methods end */

  /* Render methods for various cell type */
  const renderSumAmount = () => {
    if(!transactions.length) return 0;
    let sum = 0;
    // Creating sum of transactions for header
    transactions.forEach(transaction => {
      if(!isNaN(transaction.Amount*1)) {
        sum+=transaction.Amount*1;
      }
    });
    return formatAmount(sum);
  }

  const renderDate = (date, isPositive) => {
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return <span className={isPositive? 'font-green' : 'font-gray'}>{`${mo} ${da}${formatDay()}, ${ye}`}</span>;
  }

  const renderCompany = (name, isPositive) => {
    return <span className={isPositive? 'font-green' : 'font-black'}>{name}</span>
  }

  const renderLedger = (ledger, isPositive) => {
    return <span className={isPositive? 'font-green' : 'font-gray'}>{ledger}</span>
  }

  const renderAmount = (amount, isPositive) => {
    return <span className={isPositive? 'font-green' : 'font-black'}>{formatAmount(amount)}</span>;
  }
  /* Render methods for various cell type end */

  /* Render method for each transaction row */
  const renderTransaction = (transaction, index) => {
    // Check if amount is positive/negative to toggle green/black/gray font colors
    let isPositive = !isNaN(transaction.Amount*1) && transaction.Amount*1 > 0;
    return (<div key={index} className="transaction-row">
              {/* Render cells based on the credit/debit transaction */}
              <div className="cell-1">{renderDate(new Date(transaction.Date), isPositive)}</div>
              <div className="cell-2">{renderCompany(transaction.Company, isPositive)}</div>
              <div className="cell-3">{renderLedger(transaction.Ledger, isPositive)}</div>
              <div className="cell-4">{renderAmount(transaction.Amount, isPositive)}</div>
            </div>);
  }
  /* Render method for each transaction row end */

  /* Main Render */
  return (
    <div className="App">
      <div className="header">Bench Test</div>
      <div className="transaction-container">
        <div className="row-header transaction-row">
          <div className="cell-1 font-green">Date</div>
          <div className="cell-2 font-green">Company</div>
          <div className="cell-3 font-green">Account</div>
          <div className="cell-4 font-green">{renderSumAmount()}</div>
        </div>
        {transactions && transactions.map((transaction, index) => (
            renderTransaction(transaction, index)
        ))}
      </div>
    </div>
  );
}

export default App;
