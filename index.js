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

    const monthNames = ["нулевой месяц", "янв", "фев", "мар", "апр", "май", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек"
    ];
    
    const [expensePerWeekStatus, setExpensePerWeekStatus] = useState(false)

    function showExpensesPerWeek(){
        setExpensePerWeekStatus(x => !x)
    }


return <main>
    <form onSubmit = {handleClick}>
    <fieldset>
        <input className='expense-input' value={homeExpenseInput} type="number" id="homeExpense" name="homeExpense" placeholder="Дом. расход" onChange={handleHomeExpenseInput}/><br/>
        </fieldset>
    <fieldset>
        <input className='expense-input' value={ownExpenseInput} type="number" id="ownExpense" name="ownExpense" placeholder="Наш расход" onChange={handleOwnExpenseInput}/><br/>
    </fieldset>
    <fieldset>
        <input className='expense-input' value={drugsExpenseInput} type="number" id="drugExpense" name="drugExpense" placeholder="Лекарства" onChange={handleDrugExpenseInput}/><br/>
    </fieldset>
    <input className='expense-submit' type="submit" value="Сохранить"/>
    </form>
    <section>
        <div>
        {expenses.slice(0).slice(-3).reverse().map((x, index)=>{
            let thisId = x.id
        return <div className='total-container' key={index}>
            <div className='single-expense'>
                Расход за день: {Number(x.homeExpense) + Number(x.ownExpense) + Number(x.drugExpense)}
                {/* / Дом: {x.homeExpense} / 
                Наш: {x.ownExpense} / 
                Лек: {x.drugExpense} */}
            </div>
            <div className='edit-btn-div'>
                <button className='edit-btn' onClick={()=>handleEditClick(x)}><i className="fa-solid fa-pen"></i></button>
            </div>
            <div className='delete-btn-div'>

                {isEditing?

                <>
                <form onSubmit={handleHomeExpenseEditSubmit} style={x.active? { display: 'block'} : {display: 'none'}}>

                <input className='edit-input-field item-1' placeholder='дом' type='number' onChange={handleHomeExpenseEditInput}/>
                <input className='edit-input-field item-2' placeholder='наш' type='number' onChange={handleOwnExpenseEditInput}/>
                <input className='edit-input-field item-3' placeholder='лек' type='number' onChange={handleDrugsExpenseEditInput}/>
                
                <input className='edit-submit-btn item-4' type='submit' value='ок'/>
                <button className='delete-btn item-5' onClick={()=>handleExpenseDelete(thisId)}><i className="fa-solid fa-xmark"></i></button>

                </form>

                </>
                
                : null}

            </div>
            </div> 
        })}
         </div>
        <p className='month-expense'>
            <span className='total-expense'>Общий расход за {monthNames[Number(monthButtonValue)]}: {sumTotalFiltered}</span><br></br>
            <hr></hr>
            <span className='detailed-expense'>Домашний расход: {sumOfHomeExpenseFiltered}<br></br>
            Наш расход: {sumOfOwnExpenseFiltered} <br></br>
            Лекарства: {sumOfDrugExpenseFiltered}</span>
            <hr></hr>
            </p>

       
    </section>


    <form className='option-form'>
  <label className='choose-month-label' htmlFor="cars">Выберите месяц:</label>
  <select className='custom-select' onChange={showMonthExpenses} name="cars" id="cars">
        <option className='test' value = '01'>Янв</option>
        <option value = '02'>Фев</option>
        <option value = '03'>Мар</option>
        <option value = '04'>Апр</option>
        <option value = '05'>Май</option>
        <option value = '06'>Июн</option>
        <option value = '07'>Июл</option>
        <option value = '08'>Авг</option>
        <option value = '09'>Сен</option>
        <option value = '10'>Окт</option>
        <option value = '11'>Ноя</option>       
        <option value = '12'>Дек</option>
  </select>
</form>

<button className='expense-submit' 
style={{backgroundColor: 'red', fontSize: '20px', marginTop: '10px' }} 
onClick={showExpensesPerWeek}>Расход за месяц
</button>

{expenses.slice(-31).reverse().map((x, index)=>{
            let thisId = x.id
            if (expensePerWeekStatus) {
        return <div className='total-container' key={index}>
            <div className='single-expense'>
                {/* {Number(x.homeExpense) + Number(x.ownExpense) + Number(x.drugExpense)}: */}
                <span style={{color: 'red'}}>{x.date}.{x.month}:</span> {x.homeExpense} + {x.ownExpense} + {x.drugExpense} - 
            </div>
            <div className='edit-btn-div'>
                <button className='edit-btn' onClick={()=>handleEditClick(x)}><i className="fa-solid fa-pen"></i></button>
            </div>
            <div className='delete-btn-div'>

                {isEditing?

                <>
                <form onSubmit={handleHomeExpenseEditSubmit} style={x.active? { display: 'block'} : {display: 'none'}}>

                <input className='edit-input-field item-1' placeholder='дом' type='number' onChange={handleHomeExpenseEditInput}/>
                <input className='edit-input-field item-2' placeholder='наш' type='number' onChange={handleOwnExpenseEditInput}/>
                <input className='edit-input-field item-3' placeholder='лек' type='number' onChange={handleDrugsExpenseEditInput}/>
                
                <input className='edit-submit-btn item-4' type='submit' value='ок'/>
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
