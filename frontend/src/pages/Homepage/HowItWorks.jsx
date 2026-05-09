import "../../styles/Homepage/howitworks.css";

function HowItWorks() {
  return (
    <section className="how">

      <h2>How It Works</h2>

      <p className="how-sub">
        Easily track and split group expenses with your friends and family.
      </p>

      <div className="steps">

        <div className="step">
          <img src="/images/create-group.png" alt="Create Group"/>
          <h3>Create Groups</h3>
          <p>Easily track group expenses with friends.</p>
        </div>

        <div className="step">
          <img src="/images/add-expense.png" alt="Add Expense"/>
          <h3>Add Expenses</h3>
          <p>Record spending and split automatically.</p>
        </div>

        <div className="step">
          <img src="/images/settle-debt.png" alt="Settle Debts"/>
          <h3>Settle Debts</h3>
          <p>Quickly settle balances with friends.</p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;