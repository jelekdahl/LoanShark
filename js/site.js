function calculateFormLoan(formId, tbodyId, monthlyId, principalId, interestId, costId) {
  let formInput = getFormInput(formId);

  if (!formInput) {
    document.getElementById(tbodyId).innerHTML = '';
  } else {
    let monthlyPct = formInput.interestRate / 1200;
    let monthlyPmt = getMonthlyPayment(formInput.loanAmount, formInput.termMonths, monthlyPct);

    let loanData = {
      balance: formInput.loanAmount,
      monthNumber: 1,
      monthlyRate: monthlyPct,
      monthlyPayment: monthlyPmt,
      totalPrincipal: 0,
      totalInterest: 0
    };

    addNewPayments(tbodyId, loanData);
    outputSummary(loanData, monthlyId, principalId, interestId, costId);
  }
}

function getFormInput(formId) {
  let loanForm = document.getElementById(formId);
  let formData = new FormData(loanForm);
  let formInput = Object.fromEntries(formData);

  formInput.loanAmount = parseFloat(formInput.loanAmount);
  if (!isValidLoanAmount(formInput.loanAmount)) {
    formInput = null;
  } else {
    formInput.termMonths = parseInt(formInput.termMonths);
    if (!isValidMonthCount(formInput.termMonths)) {
      formInput = null;
    } else {
      formInput.interestRate = parseFloat(formInput.interestRate);
      if (!isValidInterestRate(formInput.interestRate)) {
        formInput = null;
      }
    }
  }

  return formInput;
}

function isValidLoanAmount(value) {
  if (Number.isNaN(value) || value <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Loan Amount',
      text: `Please change Loan Amount to a number greater than 0.`,
    });

    return false;
  }

  return true;
}

function isValidMonthCount(value) {
  if (!Number.isInteger(value) || value < 1) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Month Count',
      text: `Please change Term (Months) to an integer greater than 0.`,
    });

    return false;
  }

  return true;
}

function isValidInterestRate(value) {
  if (Number.isNaN(value) || value < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Interest Rate',
      text: `Please change Interest Rate to a number greater than or equal to 0.`,
    });

    return false;
  }

  return true;
}

function getMonthlyPayment(balance, monthsLeft, monthlyRate) {
  if (monthlyRate == 0) return balance / monthsLeft;
  return (balance * monthlyRate / (1 - Math.pow(1 + monthlyRate, -monthsLeft)));
}

function addNewPayments(tbodyId, loanData) {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  let tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';

  let newRow, newCell;
  let monthlyPayment, interestPayment, principalPayment;

  while (loanData.balance > 0) {

    newRow = document.createElement('tr');

    // Month
    newCell = document.createElement('td');
    newCell.innerText = loanData.monthNumber++;
    newRow.appendChild(newCell);

    interestPayment = loanData.balance * loanData.monthlyRate;
    monthlyPayment = Math.min(loanData.monthlyPayment, loanData.balance + interestPayment);
    principalPayment = monthlyPayment - interestPayment;

    // Payment
    newCell = document.createElement('td');
    newCell.innerText = formatter.format(monthlyPayment);
    newRow.appendChild(newCell);

    // Principal
    newCell = document.createElement('td');
    newCell.innerText = formatter.format(principalPayment);
    newRow.appendChild(newCell);

    // Interest
    newCell = document.createElement('td');
    newCell.innerText = formatter.format(interestPayment);
    newRow.appendChild(newCell);

    // Total Interest
    loanData.totalInterest += interestPayment;
    newCell = document.createElement('td');
    newCell.innerText = formatter.format(loanData.totalInterest);
    newRow.appendChild(newCell);

    // Balance
    loanData.balance -= principalPayment;
    newCell = document.createElement('td');
    newCell.innerText = formatter.format(loanData.balance);
    newRow.appendChild(newCell);

    // Total Principal -- Keep hidden
    loanData.totalPrincipal += principalPayment;
    newCell = document.createElement('td');
    newCell.classList.add('d-none');
    newCell.innerText = formatter.format(loanData.totalPrincipal);
    newRow.appendChild(newCell);

    tbody.appendChild(newRow);
  }
}

function outputSummary(loanData, monthlyId, principalId, interestId, costId) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  // Monthly payment
  let monthlyPayment = document.getElementById(monthlyId);
  monthlyPayment.innerText = formatter.format(loanData.monthlyPayment);

  // Total principal
  let totalPrincipal = document.getElementById(principalId);
  totalPrincipal.innerText = formatter.format(loanData.totalPrincipal);

  // Total interest
  let totalInterest = document.getElementById(interestId);
  totalInterest.innerText = formatter.format(loanData.totalInterest);

  // Total cost
  let totalCost = document.getElementById(costId);
  totalCost.innerText = formatter.format(
    loanData.totalPrincipal + loanData.totalInterest
  );
}