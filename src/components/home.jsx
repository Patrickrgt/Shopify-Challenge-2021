import React from "react";
// Images
import LikeHeart from "../img/heart.svg";
import FilledHeart from "../img/filledHeart.svg";
import Hamburger from "../img/hamburger.svg";
import Cancel from "../img/cancel.svg";
import Loading from "../img/loading.gif";
// Cookie libraries
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class Home extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = {
      //  Liked Data
      apodLiked: [],
      //   API Key
      apiKey: "ciu4LVJAv0P9RDprNhplCmvZSm3JZOfN46dWHKff",
      //   Conditionals
      gettingAPOD: false,
      activeTab: "APOD",
      loading: false,
      showTabs: false,
      // Query Section
      apodQuery: cookies.get("apodQuery") || [],
      // Liked Section
      apodDates: cookies.get("apodLiked") || [],
      // Tabs
      allTabs: ["APOD", "Liked"],
      tabRef: ["apodQuery", "apodLiked"],
      // Dates
      day: 0,
      year: 0,
      month: 0,
    };
  }

  // When application runs do:
  async componentDidMount() {
    // Check if API has been fetched, if not, fetch for API
    if (this.state.apodQuery.length <= 0) {
      this.APODImage();
    }
    // Event handler when scrolling
    window.addEventListener("scroll", () => this.handleScroll(), true);
  }
  // Remove event handler on unmount
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  // Event handler on scroll
  async handleScroll(e) {
    // If the user moves down the page, make the NAV stick to user's viewport
    if (window.scrollY > 100) {
      document.getElementById("nav").style.position = "fixed";
    } else document.getElementById("nav").style.position = "relative";
    // If user reaches the bottom of the page then load more posts by fetching from API
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (this.state.activeTab === "APOD") {
        if (this.state.gettingAPOD === false) {
          this.setState(
            {
              gettingAPOD: true,
              loading: true,
            },
            () => {
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
        // Adds more post on top of original, does not create a new one because
        // I had problems saving the liked posts on new array rather than just
        // manipulating the original
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

    // If cookies have been fetched then set the liked posts state
    // This unwraps the cookie storage of dates into an array because I can't
    // store a bunch of objects into a cookie so I have to wrap and unwrap
    if (this.state.apodDates.length > 0) {
      let i = 0;
      let posts = [];
      this.state.apodQuery.forEach(() => {
        var res = this.state.apodQuery.filter((el) =>
          el.date.includes(this.state.apodDates[i])
        );
        i++;
        if (res.length > 0) {
          posts.push(...res);
        }
      });

      this.setState({
        apodLiked: posts,
      });
    } else return;
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
    // Makes sure the days do not go over the month limit and makes
    // sure the month does not go over the year limit
    var daysInMonth = new Date(year, month, 0).getDate();
    if (day <= 0) {
      month = this.state.month - 1;
      daysInMonth = new Date(year, month, 0).getDate();
      day += daysInMonth;
    }

    // Once finished, fetches API with date query, date is usually a week before today
    let dateQuery = `https://api.nasa.gov/planetary/apod?start_date=${year}-${month}-${day}&thumbs=true&api_key=${this.state.apiKey}`;
    await fetch(dateQuery)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          apodQuery: data.reverse(),
        });
      });

    // If cookies have been fetched then set the liked posts state
    // This unwraps the cookie storage of dates into an array because I can't
    // store a bunch of objects into a cookie so I have to wrap and unwrap
    if (this.state.apodDates.length > 0) {
      let i = 0;
      let posts = [];
      this.state.apodQuery.forEach(() => {
        var res = this.state.apodQuery.filter((el) =>
          el.date.includes(this.state.apodDates[i])
        );
        i++;
        if (res.length > 0) {
          posts.push(...res);
        }
      });

      this.setState({
        apodLiked: posts,
      });
    } else return;
  }

  // Function that runs when a user likes a post
  async like(e, i) {
    // set cookie library to variable
    const { cookies } = this.props;
    // Checks if user is on the right page
    if (this.state.activeTab === "APOD") {
      // Set liked posts state to push new object to original state
      await this.setState(
        {
          apodLiked: [e, ...this.state.apodLiked],
        },
        // After setting state, set the cookies to date to wrap
        // because I cannot store a bunch of objects into a cookie
        () => {
          const { dates } = { dates: this.state.apodLiked.map((a) => a.date) };
          cookies.set("apodLiked", dates, { path: "/" });
        }
      );
    }
  }

  // Function that runs when a user unlikes a post
  async unlike(e, i) {
    // Checks which tab the user is in
    if (this.state.activeTab === "APOD") {
      // Cookie wrapper to remove the wrapped post
      const oldDates = this.state.apodDates;
      const newDates = oldDates.filter((item) => item !== e.date);
      // Removes the liked post from the state
      const oldLikes = this.state.apodLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        apodLiked: newLikes,
        apodDates: newDates,
      });
      // Checks which tab the user is in
    } else if (this.state.activeTab === "Liked") {
      // Cookie wrapper to remove the wrapped post
      const oldDates = this.state.apodDates;
      const newDates = oldDates.filter((item) => item !== e.date);
      // Removes the liked post from the state
      const oldLikes = this.state.apodLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        apodLiked: newLikes,
        apodDates: newDates,
      });
    }
  }

  // Changes active tabs through states
  // states used for ternary conditionals when mapping
  async changeActive(e) {
    this.setState({
      activeTab: e,
      showTabs: false,
    });
  }

  // Shows Navigation tabs
  async showTabs() {
    this.setState({
      showTabs: true,
    });
  }

  // Hides Navigation tabs
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
            <h1 className="n-logo">Astrography</h1>
            {/* Ternary conditional to check mobile window if menu has been activated */}
            {this.state.showTabs === false ? (
              // If window is mobile then show hamburger menu
              <button
                onClick={() => this.showTabs()}
                className="n-menu animate__animated animate__flipInX"
              >
                <img className="n-button" src={Hamburger} alt="" />
              </button>
            ) : (
              // If hamburger menu is clicked then show the x button
              <button
                onClick={() => this.hideTabs()}
                className="n-menu animate__animated animate__rotateIn"
              >
                <img className="n-button" src={Cancel} alt="" />
              </button>
            )}
          </section>

          {/* If showTabs is true then APOD and Liked will appear on the NAV */}
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
        {/* Ternary conditional to check state if user clicked/is on APOD */}
        {this.state.activeTab === "APOD" ? (
          <main
            className={
              this.state.activeTab === "APOD" ? "active-tab" : "inactive-tab"
            }
          >
            {/* Overall Post Container */}
            <div className="p-box">
              {/* Post Container */}
              {/* Conditional to check if API has been fetched and data is on state */}
              {this.state.apodQuery.length > 0 ? (
                <div className="p-container">
                  {/* Maps the data */}
                  {this.state.apodQuery.map((apod, index) => (
                    <section className="animate__animated animate__fadeIn p-border">
                      <div className="p-img-box">
                        <article className="p-button-container">
                          {/* Conditional for like button used for cookies */}
                          {/* Cookies have to wrap to date and unwrap through this conditional */}
                          {/* Filters API fetch from cookie date array to find likes */}
                          {this.state.apodDates.includes(apod.date) ||
                          // If liked, then show a filled heart
                          this.state.apodLiked.includes(apod) ? (
                            <button onClick={(e) => this.unlike(apod, index)}>
                              <img alt="You liked this" src={FilledHeart} />
                            </button>
                          ) : (
                            // If not liked, show a white heart
                            <button onClick={(e) => this.like(apod, index)}>
                              <img alt="Click to like this" src={LikeHeart} />
                            </button>
                          )}
                        </article>
                        {/* Post Image */}
                        {/* If youtube video then show thumbnail of video */}

                        <div className="p-img-container">
                          {apod.url.includes("youtube") ? (
                            <img
                              alt={apod.explanation}
                              src={apod.thumbnail_url}
                            ></img>
                          ) : (
                            <img alt={apod.explanation} src={apod.url}></img>
                          )}
                        </div>
                        {/* Title of Post */}
                        {/* If post is a youtube video then click link for video */}
                        <div>
                          {apod.url.includes("youtube") ? (
                            <a className="p-link" href={apod.url}>
                              <h1 className="p-title animate__animated animate__fadeInUp">
                                {apod.title}
                              </h1>
                            </a>
                          ) : (
                            // Regular Title Post
                            <h1 className="p-title animate__animated animate__fadeInUp">
                              {apod.title}
                            </h1>
                          )}
                        </div>
                        {/* Sub */}
                        {/* Subheading with post description */}
                        <aside className="p-sub-col animate__animated animate__fadeInUp">
                          <span className="p-sub-date">
                            <p>{apod.date} </p>
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
              ) : (
                // If API is not fetched show loading gif fallback
                <footer className="l-footer">
                  <img src={Loading} alt="The page is loading" />
                </footer>
              )}
            </div>
            {/* If API is not fetched show loading gif */}
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
        {/* Ternary conditional to check state if user clicked/is on APOD */}
        {this.state.apodLiked !== [] ? (
          <main
            className={
              this.state.activeTab === "Liked" ? "active-tab" : "inactive-tab"
            }
          >
            {/* Overall Post Container */}
            <div className="p-box">
              {/* Post Container */}
              {/* Conditional to check if Liked state has data from cookies, or user */}
              {this.state.apodLiked.length > 0 ? (
                <div className="p-container">
                  {/* Maps the data */}
                  {this.state.apodLiked.reverse().map((apod, index) => (
                    <section className="p-border">
                      <div className="p-img-box">
                        <article className="p-button-container">
                          {/* Conditional for like buttons used for cookies */}
                          {/* Less complicated than APOD tab, filters to make sure the post is within the liked post state */}
                          {this.state.apodLiked.includes(apod) ? (
                            // If liked, then show a filled heart
                            <button onClick={(e) => this.unlike(apod, index)}>
                              <img alt="You liked this" src={FilledHeart} />
                            </button>
                          ) : (
                            // If not liked, show a white heart
                            <button onClick={(e) => this.like(apod, index)}>
                              <img alt="Click to like this" src={LikeHeart} />
                            </button>
                          )}
                        </article>
                        {/* Post Image */}
                        {/* If youtube video then show thumbnail of video */}

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
                        {/* If post is a youtube video then click link for video */}
                        <div>
                          {apod.url.includes("youtube") ? (
                            <a className="p-link" href={apod.url}>
                              <h1 className="p-title animate__animated animate__fadeInUp">
                                {apod.title}
                              </h1>
                            </a>
                          ) : (
                            // Regular Title Post
                            <h1 className="p-title animate__animated animate__fadeInUp">
                              {apod.title}
                            </h1>
                          )}
                        </div>
                        {/* Sub */}
                        {/* Subheading with post description */}
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
              ) : (
                // If Liked page has no likes then show this text
                <div className="error-message">
                  Uh oh, you don't have any likes! Check out the APOD Tab
                  (Astronomy Post Of the Day) to start liking some posts!
                </div>
              )}
            </div>
          </main>
        ) : (
          // Fallback if something happens if the first ternary does not run
          <span>Like some posts, your list is empty!</span>
        )}
        {/* END OF APOD SECTION */}
        {/*  */}
        {/*  */}
      </div>
    );
  }
}

export default withCookies(Home);
