import React from "react";
// import RandomName from "./randomName";
import LikeHeart from "../img/heart.svg";
import FilledHeart from "../img/filledHeart.svg";
import Hamburger from "../img/hamburger.svg";
import Cancel from "../img/cancel.svg";
import Loading from "../img/loading.gif";

class Home extends React.Component {
  state = {
    //   API Key
    apiKey: "gi4ZhiNqn90aKZyhpLp3H5dpDMEKaCS4EAXcYQnX",
    //   Conditional
    gettingAPOD: false,
    activeTab: "APOD",
    loading: false,
    showTabs: false,
    // Query Section
    apodQuery: [],
    // Liked Section
    apodLiked: [],
    // Misc
    EPICImages: [],
    // Tabs
    allTabs: ["APOD", "Liked"],
    tabRef: ["apodQuery", "apodLiked"],
    // Dates
    day: 0,
    year: 0,
    month: 0,
  };

  async componentDidMount() {
    this.APODImage();

    window.addEventListener("scroll", () => this.handleScroll(), true);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  async handleScroll(e) {
    console.log(window.scrollY);

    if (window.scrollY > 100) {
      document.getElementById("nav").style.position = "fixed";
    } else document.getElementById("nav").style.position = "relative";

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (this.state.activeTab === "APOD") {
        if (this.state.gettingAPOD === false) {
          this.setState(
            {
              gettingAPOD: true,
              loading: true,
            },
            () => {
              console.log(this.state.gettingAPOD);
              console.log(this.state.apodLiked);
              this.getMoreAPOD();
            }
          );
        } else return;
      }
    }
  }

  //   Gets more APOD posts if user reaches bottom of page
  async getMoreAPOD() {
    //   Date initalization
    var day = this.state.day - 7;
    var year = this.state.year;
    var month = this.state.month;
    //   Date conditionals to make sure everything is smooth
    if (day <= 0) {
      month = this.state.month - 1;
      var daysInMonth = new Date(year, month, 0).getDate();
      day += daysInMonth;
      if (month === 0) {
        month += 12;
        year = this.state.year - 1;
      }
    }
    //   State date initalization
    this.setState({
      day,
      month,
      year,
    });
    //   Query fetch for more APOD
    let dateQuery = `https://api.nasa.gov/planetary/apod?start_date=${year}-${month}-${day}&thumbs=true&api_key=${this.state.apiKey}`;
    await fetch(dateQuery)
      .then((response) => response.json())
      .then((data) => {
        let newArray = data;
        let oldArray = this.state.apodQuery;
        let res = oldArray.concat(
          newArray.filter(({ url }) => !oldArray.find((x) => x.url === url))
        );
        this.setState({
          apodQuery: res,
          gettingAPOD: false,
        });
      });
    console.log(this.state.apodQuery);
  }
  // End of getMoreAPOD
  // * * *
  // * * *

  //   Initalizes APOD Tab
  async APODImage() {
    //   Date initalization
    var dt = new Date();
    var day = dt.getDate() - 7;
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    //   Date conditionals to make sure everything is smooth
    this.setState({
      day,
      month,
      year,
    });
    var daysInMonth = new Date(year, month, 0).getDate();
    if (day <= 0) {
      month = this.state.month - 1;
      daysInMonth = new Date(year, month, 0).getDate();
      day += daysInMonth;
    }

    let dateQuery = `https://api.nasa.gov/planetary/apod?start_date=${year}-${month}-${day}&thumbs=true&api_key=${this.state.apiKey}`;
    await fetch(dateQuery)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          apodQuery: data.reverse(),
        })
      );
    console.log(this.state.apodQuery);
  }

  async like(e, i) {
    if (this.state.activeTab === "APOD") {
      await this.setState({
        apodLiked: [e, ...this.state.apodLiked],
      });
    }
  }

  async unlike(e, i) {
    if (this.state.activeTab === "APOD") {
      const oldLikes = this.state.apodLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        apodLiked: newLikes,
      });
    } else if (this.state.activeTab === "Liked") {
      const oldLikes = this.state.apodLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        apodLiked: newLikes,
      });
    }
  }

  async changeActive(e) {
    this.setState({
      activeTab: e,
      showTabs: false,
    });
  }

  async showTabs() {
    this.setState({
      showTabs: true,
    });
  }

  async hideTabs() {
    this.setState({
      showTabs: false,
    });
  }

  render() {
    return (
      <div>
        {/*  */}
        {/*  */}
        {/* NAVIGATION SECTION */}
        <nav id="nav" className="animate__animated animate__fadeInDown">
          <section className="n-menu-row">
            <h1 className="n-logo">Spacestagram</h1>

            {this.state.showTabs === false ? (
              <button
                onClick={() => this.showTabs()}
                className="n-menu animate__animated animate__flipInX"
              >
                <img className="n-button" src={Hamburger} alt="" />
              </button>
            ) : (
              <button
                onClick={() => this.hideTabs()}
                className="n-menu animate__animated animate__rotateIn"
              >
                <img className="n-button" src={Cancel} alt="" />
              </button>
            )}
          </section>

          <nav
            className={
              this.state.showTabs === true ? "n-menu-active" : "n-menu-inactive"
            }
          >
            {this.state.allTabs.map((tab) => (
              <section
                className={
                  this.state.activeTab === tab ? "n-item active" : "n-item"
                }
              >
                <button onClick={(e) => React.memo(this.changeActive(tab))}>
                  {tab}
                </button>
              </section>
            ))}
          </nav>
        </nav>
        {/* END OF NAVIGATION SECTION */}
        {/*  */}
        {/*  */}

        {/*  */}
        {/*  */}
        {/* APOD SECTION */}
        {this.state.activeTab === "APOD" ? (
          <main
            className={
              this.state.activeTab === "APOD" ? "active-tab" : "inactive-tab"
            }
          >
            {/* Overall Post Container */}
            <div className="p-box">
              {/* Post Container */}
              <div className="p-container">
                {this.state.apodQuery.map((apod, index) => (
                  <section className="animate__animated animate__fadeIn p-border">
                    <div className="p-img-box">
                      <article className="p-button-container">
                        {/* Like Button */}
                        {this.state.apodLiked.reverse().includes(apod) ? (
                          <button onClick={(e) => this.unlike(apod, index)}>
                            <img alt="You liked this" src={FilledHeart} />
                          </button>
                        ) : (
                          <button onClick={(e) => this.like(apod, index)}>
                            <img alt="Click to like this" src={LikeHeart} />
                          </button>
                        )}
                      </article>
                      {/* Post Image */}
                      <div className="p-img-container">
                        {apod.url.includes("youtube") ? (
                          <a href={apod.url}>
                            <img
                              alt={apod.explanation}
                              src={apod.thumbnail_url}
                            ></img>
                          </a>
                        ) : (
                          <img alt={apod.explanation} src={apod.url}></img>
                        )}
                      </div>
                      {/* Title of Post */}
                      <h1 className="p-title animate__animated animate__fadeInUp">
                        {apod.title}
                      </h1>
                      {/* Sub */}
                      <aside className="p-sub-col animate__animated animate__fadeInUp">
                        <span className="p-sub-date">
                          <p>Date of Capture: {apod.date} </p>
                        </span>
                        <hr />
                        <footer className="p-sub">
                          <p>{apod.explanation} </p>
                        </footer>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
            {this.state.loading === true ? (
              <footer className="l-footer">
                <img src={Loading} alt="The page is loading" />
              </footer>
            ) : (
              <footer className="l-footer"></footer>
            )}
          </main>
        ) : (
          <span></span>
        )}
        {/* END OF APOD SECTION */}
        {/*  */}
        {/*  */}

        {/* APOD Liked */}
        {this.state.apodLiked !== [] ? (
          <main
            className={
              this.state.activeTab === "Liked" ? "active-tab" : "inactive-tab"
            }
          >
            <div className="p-box">
              <div className="p-container">
                {this.state.apodLiked.reverse().map((apod, index) => (
                  <section className="p-border">
                    <div className="p-img-box">
                      <article className="p-button-container">
                        {this.state.apodLiked.includes(apod) ? (
                          <button onClick={(e) => this.unlike(apod, index)}>
                            <img alt="You liked this" src={FilledHeart} />
                          </button>
                        ) : (
                          <button onClick={(e) => this.like(apod, index)}>
                            <img alt="Click to like this" src={LikeHeart} />
                          </button>
                        )}
                      </article>
                      <div className="p-img-container">
                        {apod.url.includes("youtube") ? (
                          <a href={apod.url}>
                            <img
                              alt={apod.explanation}
                              src={apod.thumbnail_url}
                            ></img>
                          </a>
                        ) : (
                          <img alt={apod.explanation} src={apod.url}></img>
                        )}
                      </div>

                      <h1 className="p-title">{apod.title}</h1>

                      <aside className="p-sub-col">
                        <span className="p-sub-date">
                          <p>Date of Capture: {apod.date} </p>
                        </span>
                        <hr />
                        <footer className="p-sub">
                          <p>{apod.explanation} </p>
                        </footer>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <span>Like some posts, your list is empty!</span>
        )}
        {/* END OF APOD SECTION */}
        {/*  */}
        {/*  */}
      </div>
    );
  }
}

export default Home;
