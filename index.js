const { useState, useEffect, useContext, useRef } = React;

function App() {

    const LOCAL_STORAGE_KEY = 'expensesApp.expenses'

    const [userInput, setUserInput] = useState('')
    const [homeExpenseInput, setHomeExpenseInput] = useState('')
    const [ownExpenseInput, setOwnExpenseInput] = useState('')
    const [drugsExpenseInput, setDrugsExpenseInput] = useState('')
    const [expenses, setExpenses] = useState([])

    const [isEditing, setIsEditing] = useState(false);
    const [currentHomeExpense, setCurrentHomeExpense] = useState();
    // const [currentOwnExpense, setCurrentOwnExpense] = useState();
    // const [currentDrugsExpense, setCurrentDrugsExpense] = useState();

    const [initId, setId] = useState(0)
    const incrementCount = () => {
        setId(initId + 1);
      };

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (storedExpenses) setExpenses(storedExpenses)
      }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses))
      },

      [expenses])

    useEffect(()=>{incrementCount()}, [expenses])

    const handleHomeExpenseInput = (e) => {
        setHomeExpenseInput(e.target.value)     
    }

    const handleOwnExpenseInput = (e) => {
        setOwnExpenseInput(e.target.value)     
    }

    const handleDrugExpenseInput = (e) => {
        setDrugsExpenseInput(e.target.value)
    }

    const handleClick = (e)=> {
        e.preventDefault()
        const d = new Date();
        let month = String(d.getMonth()+1).padStart(2, '0');
        let date = String(d.getDate()).padStart(2, '0');
        let year = d.getFullYear()
        setExpenses([...expenses, {id: Date.now(),
            homeExpense: homeExpenseInput, ownExpense: ownExpenseInput, drugExpense: drugsExpenseInput,
            date: date, month: month, year: year, active: false}])
        setHomeExpenseInput('')
        setOwnExpenseInput('')
        setDrugsExpenseInput('')

    }

    const handleEditClick = (arg) => {
        setIsEditing(prevCheck => !prevCheck)
        expenses.map(x=>x.id === arg.id ? x.active = true : x.active = false)
        setCurrentHomeExpense({...arg})
        console.log(expenses)
    }

    const handleHomeExpenseEditInput = (e) => {
        setCurrentHomeExpense({...currentHomeExpense, homeExpense: e.target.value})
    }

    const handleOwnExpenseEditInput = (e) => {
        setCurrentHomeExpense({...currentHomeExpense, ownExpense: e.target.value})
    }

    const handleDrugsExpenseEditInput = (e) => {
        setCurrentHomeExpense({...currentHomeExpense, drugExpense: e.target.value})
    }

    const handleHomeExpenseEditSubmit = (e) => {
        e.preventDefault()
        handleUpdateExpense(currentHomeExpense.id, currentHomeExpense);
    }

    // const handleOwnExpenseEditSubmit = (e) => {
    //     e.preventDefault()
    //     handleUpdateExpense(currentOwnExpense.id, currentOwnExpense);
    // }

    // const handleDrugsExpenseEditSubmit = (e) => {
    //     e.preventDefault()
    //     handleUpdateExpense(currentDrugsExpense.id, currentDrugsExpense);
    // }

    function handleUpdateExpense(id, updatedExpense) {

        const updatedItem = expenses.map((expense) => {
          return expense.id === id ? updatedExpense : expense;
        });
        setIsEditing(false);
        setExpenses(updatedItem);
      }

    function handleExpenseDelete(id) {
        const updatedItem = expenses.filter((expense) => {
            return expense.id !== id;
          });
        setExpenses(updatedItem);
        setIsEditing(false);
    }

    // Variable for current month
    const myDate = new Date()
    let myMonth = String(myDate.getMonth()+1).padStart(2, '0');

    // Button value
    const [monthButtonValue, setMonthButtonValue] = useState(myMonth)

    // Total sum and Sum per specific month
    const sumOfHomeExpense = expenses.reduce((a, b) => Number(a) + Number(b.homeExpense), 0)
    const sumOfOwnExpense = expenses.reduce((a, b) => Number(a) + Number(b.ownExpense), 0)
    const sumTotal = sumOfHomeExpense + sumOfOwnExpense

    const filtered = expenses.filter(x=> x.month == monthButtonValue)
    const sumOfHomeExpenseFiltered = filtered.reduce((a, b) => Number(a) + Number(b.homeExpense), 0)
    const sumOfOwnExpenseFiltered = filtered.reduce((a, b) => Number(a) + Number(b.ownExpense), 0)
    const sumOfDrugExpenseFiltered = filtered.reduce((a, b) => Number(a) + Number(b.drugExpense), 0)
    const sumTotalFiltered = sumOfHomeExpenseFiltered + sumOfOwnExpenseFiltered + sumOfDrugExpenseFiltered
    
    const showMonthExpenses = (e)=>{
          setMonthButtonValue(e.target.value)
    }

    const monthNames = ["?????????????? ??????????", "??????", "??????", "??????", "??????", "??????", "??????",
    "??????", "??????", "??????", "??????", "??????", "??????"
    ];
    
    const [expensePerWeekStatus, setExpensePerWeekStatus] = useState(false)

    function showExpensesPerWeek(){
        setExpensePerWeekStatus(x => !x)
    }


return <main>
    <form onSubmit = {handleClick}>
    <fieldset>
        <input className='expense-input' value={homeExpenseInput} type="number" id="homeExpense" name="homeExpense" placeholder="??????. ????????????" onChange={handleHomeExpenseInput}/><br/>
        </fieldset>
    <fieldset>
        <input className='expense-input' value={ownExpenseInput} type="number" id="ownExpense" name="ownExpense" placeholder="?????? ????????????" onChange={handleOwnExpenseInput}/><br/>
    </fieldset>
    <fieldset>
        <input className='expense-input' value={drugsExpenseInput} type="number" id="drugExpense" name="drugExpense" placeholder="??????????????????" onChange={handleDrugExpenseInput}/><br/>
    </fieldset>
    <input className='expense-submit' type="submit" value="??????????????????"/>
    </form>
    <section>
        <div>
        {expenses.slice(0).slice(-3).reverse().map((x, index)=>{
            let thisId = x.id
        return <div className='total-container' key={index}>
            <div className='single-expense'>
                ???????????? ???? ????????: {Number(x.homeExpense) + Number(x.ownExpense) + Number(x.drugExpense)}
                {/* / ??????: {x.homeExpense} / 
                ??????: {x.ownExpense} / 
                ??????: {x.drugExpense} */}
            </div>
            <div className='edit-btn-div'>
                <button className='edit-btn' onClick={()=>handleEditClick(x)}><i className="fa-solid fa-pen"></i></button>
            </div>
            <div className='delete-btn-div'>

                {isEditing?

                <>
                <form onSubmit={handleHomeExpenseEditSubmit} style={x.active? { display: 'block'} : {display: 'none'}}>

                <input className='edit-input-field item-1' placeholder='??????' type='number' onChange={handleHomeExpenseEditInput}/>
                <input className='edit-input-field item-2' placeholder='??????' type='number' onChange={handleOwnExpenseEditInput}/>
                <input className='edit-input-field item-3' placeholder='??????' type='number' onChange={handleDrugsExpenseEditInput}/>
                
                <input className='edit-submit-btn item-4' type='submit' value='????'/>
                <button className='delete-btn item-5' onClick={()=>handleExpenseDelete(thisId)}><i className="fa-solid fa-xmark"></i></button>

                </form>

                </>
                
                : null}

            </div>
            </div> 
        })}
         </div>
        <p className='month-expense'>
            <span className='total-expense'>?????????? ???????????? ???? {monthNames[Number(monthButtonValue)]}: {sumTotalFiltered}</span><br></br>
            <hr></hr>
            <span className='detailed-expense'>???????????????? ????????????: {sumOfHomeExpenseFiltered}<br></br>
            ?????? ????????????: {sumOfOwnExpenseFiltered} <br></br>
            ??????????????????: {sumOfDrugExpenseFiltered}</span>
            <hr></hr>
            </p>

       
    </section>


    <form className='option-form'>
  <label className='choose-month-label' htmlFor="cars">???????????????? ??????????:</label>
  <select className='custom-select' onChange={showMonthExpenses} name="cars" id="cars">
        <option className='test' value = '01'>??????</option>
        <option value = '02'>??????</option>
        <option value = '03'>??????</option>
        <option value = '04'>??????</option>
        <option value = '05'>??????</option>
        <option value = '06'>??????</option>
        <option value = '07'>??????</option>
        <option value = '08'>??????</option>
        <option value = '09'>??????</option>
        <option value = '10'>??????</option>
        <option value = '11'>??????</option>       
        <option value = '12'>??????</option>
  </select>
</form>

<button className='expense-submit' 
style={{backgroundColor: 'red', fontSize: '20px', marginTop: '10px' }} 
onClick={showExpensesPerWeek}>???????????? ???? ??????????
</button>

{expenses.slice(-31).reverse().map((x, index)=>{
            let thisId = x.id
            if (expensePerWeekStatus) {
        return <div className='total-container' key={index}>
            <div className='single-expense'>
                {/* {Number(x.homeExpense) + Number(x.ownExpense) + Number(x.drugExpense)}: */}
                <span style={{color: 'red'}}>{x.date}.{x.month}:</span> {x.homeExpense} + {x.ownExpense} + {x.drugExpense} 
            </div>
            <div className='edit-btn-div'>
                <button className='edit-btn' onClick={()=>handleEditClick(x)}><i className="fa-solid fa-pen"></i></button>
            </div>
            <div className='delete-btn-div'>

                {isEditing?

                <>
                <form onSubmit={handleHomeExpenseEditSubmit} style={x.active? { display: 'block'} : {display: 'none'}}>

                <input className='edit-input-field item-1' placeholder='??????' type='number' onChange={handleHomeExpenseEditInput}/>
                <input className='edit-input-field item-2' placeholder='??????' type='number' onChange={handleOwnExpenseEditInput}/>
                <input className='edit-input-field item-3' placeholder='??????' type='number' onChange={handleDrugsExpenseEditInput}/>
                
                <input className='edit-submit-btn item-4' type='submit' value='????'/>
                <button className='delete-btn item-5' onClick={()=>handleExpenseDelete(thisId)}><i className="fa-solid fa-xmark"></i></button>

                </form>

                </>
                
                : null}

            </div>
            </div> } else {null}
        })}
        
    </main>

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)
