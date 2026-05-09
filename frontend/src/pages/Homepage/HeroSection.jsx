import "../../styles/Homepage/hero.css";

function HeroSection(){
  return(
    <section className="hero">

      <div className="hero-left">
        <h1>
          Split Group <br/>
          Expenses <span>Easily</span>
        </h1>

        <p>
          Easily track and split group expenses with your
          friends and family.
        </p>

        <button className="hero-btn">Get Started</button>
      </div>


      <div className="hero-right">

        <img src="/phone-ui.svg" className="phone" />

        <img src="/coin.svg" className="coin coin1"/>
        <img src="/coin.svg" className="coin coin2"/>

      </div>

    </section>
  )
}

export default HeroSection;