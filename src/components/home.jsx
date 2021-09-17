import React from "react";
// import RandomName from "./randomName";
import LikeHeart from "../img/heart.svg";
import FilledHeart from "../img/filledHeart.svg";
import Loading from "../img/loading.gif";

class Home extends React.Component {
  state = {
    //   API Key
    apiKey: "gi4ZhiNqn90aKZyhpLp3H5dpDMEKaCS4EAXcYQnX",
    //   Conditional
    gettingAPOD: false,
    activeTab: "",
    loading: false,
    // Query Section
    apodQuery: [],
    marsQuery: [],
    epicQuery: [],
    // Testing
    nasaAPI: [],
    queryAPI: [],
    // Liked Section
    marsLiked: [],
    epicLiked: [],
    apodLiked: [],
    // Misc
    EPICImages: [],
    // Tabs
    allTabs: ["Mars", "APOD", "EPIC", "Liked"],
    // Dates
    day: 0,
    year: 0,
    month: 0,
  };

  async componentDidMount() {
    this.APODImage();
    this.marsImage();
    this.EPICImage();

    window.addEventListener("scroll", () => this.handleScroll(), true);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  async handleScroll(e) {
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
    if (day < 0) {
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

  getStableDates() {
    //   Date initalization
    var day = this.state.day - 7;
    var year = this.state.year;
    var month = this.state.month;
    //   Date conditionals to make sure everything is smooth
    if (day < 0) {
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
  }

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
    if (day < 0) {
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

  async test() {
    console.log(this.state.apodQuery);
    console.log(this.state.apodLiked.includes(this.state.apodQuery));
  }

  async marsImage() {
    await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${this.state.apiKey}`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          marsQuery: data.photos,
        })
      );
  }

  async EPICImage() {
    var imgUrls = [];
    await fetch(
      `https://api.nasa.gov/EPIC/api/natural/images?api_key=${this.state.apiKey}`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({ epicQuery: data, activeTab: "EPIC" }, () => {
          this.state.epicQuery.forEach((epic) => {
            let date = epic.date
              .split(/(\s+)/)
              .filter((epic) => epic.trim().length > 0)[0];

            let concatUrl = `https://api.nasa.gov/EPIC/archive/natural/${date.replaceAll(
              "-",
              "/"
            )}/png/${epic.image}.png?api_key=${this.state.apiKey}`;
            imgUrls.push(concatUrl);
          });
        })
      );
    this.setState({
      EPICImages: imgUrls,
    });
  }

  async like(e, i) {
    if (this.state.activeTab === "Mars") {
      await this.setState(
        {
          marsLiked: [e, ...this.state.marsLiked],
        },
        console.log(this.state.marsLiked)
      );
    } else if (this.state.activeTab === "EPIC") {
      await this.setState(
        {
          epicLiked: [e, ...this.state.epicLiked],
        },
        console.log(this.state.marsLiked)
      );
    } else if (this.state.activeTab === "APOD") {
      await this.setState(
        {
          apodLiked: [e, ...this.state.apodLiked],
        },
        console.log(this.state.marsLiked)
      );
    }
  }

  async unlike(e, i) {
    if (this.state.activeTab === "Mars") {
      const oldLikes = this.state.marsLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        marsLiked: newLikes,
      });
    } else if (this.state.activeTab === "EPIC") {
      const oldLikes = this.state.epicLiked;
      const newLikes = oldLikes.filter((item) => item !== e);
      this.setState({
        epicLiked: newLikes,
      });
    } else if (this.state.activeTab === "APOD") {
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
    });
  }

  render() {
    return (
      <div>
        {/*  */}
        {/*  */}
        {/* NAVIGATION SECTION */}
        <nav id="nav">
          <button onClick={() => this.test()}>test</button>
          <h1 className="n-logo">NASA Viewable</h1>
          {this.state.allTabs.map((tab) => (
            <section className="n-item">
              <button onClick={(e) => React.memo(this.changeActive(tab))}>
                {tab}
              </button>
            </section>
          ))}
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
                  <section className="p-border">
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
                          <img
                            alt={apod.explanation}
                            src={apod.thumbnail_url}
                          ></img>
                        ) : (
                          <img alt={apod.explanation} src={apod.url}></img>
                        )}
                      </div>
                      {/* Title of Post */}
                      <h1 className="p-title">{apod.title}</h1>
                      {/* Sub */}
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

        {/*  */}
        {/*  */}
        {/* EPIC SECTION */}
        {/* {this.state.activeTab === "EPIC" ? (
          <main
            className={
              this.state.activeTab === "EPIC" ? "active-tab" : "inactive-tab"
            }
          >
            <div className="p-box">
              <div className="p-container">
                {this.state.epicQuery.map((epic, index) => (
                  <section className="p-border">
                    <div>
                      <h1>
                        ID: {epic.identifier} Name:{" "}
                        {RandomName(epic.identifier)}
                      </h1>
                      <img src={this.state.EPICImages[index]}></img>
                      <aside className="p-sub-like">
                        <button
                          id={`epic${index}`}
                          onClick={(e) => this.like(epic, index)}
                        >
                          <img src="" alt="" />
                        </button>
                      </aside>
                      <aside className="p-sub-row">
                        <h3>
                          Centroid Coordinates: {epic.centroid_coordinates.lat}{" "}
                          {", "} {epic.centroid_coordinates.lon}{" "}
                        </h3>
                        <h3>Identifier: {epic.identifier} </h3>
                        <h3>Date of Capture: {epic.date} </h3>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <h1></h1>
        )} */}
        {/* END OF EPIC SECTION */}
        {/*  */}
        {/*  */}

        {/*  */}
        {/*  */}
        {/* MARS ROVER SECTION */}

        {/* {this.state.activeTab === "Mars" ? (
          <main
            className={
              this.state.activeTab === "Mars" ? "active-tab" : "inactive-tab"
            }
          >
            <div className="p-box">
              <div className="p-container">
                {this.state.marsQuery.map((mars, index) => (
                  <section className="p-border">
                    <div>
                      <h1>
                        ID: {mars.id} Name: {RandomName(mars.id)}
                      </h1>

                      <img src={mars.img_src}></img>

                      <aside className="p-sub-like">
                        {this.state.marsLiked.includes(mars) ? (
                          <button onClick={(e) => this.unlike(mars, index)}>
                            <img src="" alt="" />
                          </button>
                        ) : (
                          <button onClick={(e) => this.like(mars, index)}>
                            <img src="" alt="" />
                          </button>
                        )}
                      </aside>

                      <aside className="p-sub-row">
                        <h3>Camera: {mars.camera.name} </h3>
                        <h3>Rover: {mars.rover.id} </h3>
                        <h3>Date of Capture: {mars.earth_date} </h3>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <h1></h1>
        )} */}
        {/* END OF MARS ROVER SECTION */}
        {/*  */}
        {/*  */}

        {/*  */}
        {/*  */}
        {/* LiIKED SECTION */}
        {/* {this.state.marsLiked !== [] ? (
          <main
            className={
              this.state.activeTab === "Liked" ? "active-tab" : "inactive-tab"
            }
          >
            <div className="p-box">
              <div className="p-container">
                {this.state.marsLiked.map((mars, index) => (
                  <section className="p-border">
                    <div>
                      <h1>
                        ID: {mars.id} Name: {RandomName(mars.id)}
                      </h1>
                      <img src={mars.img_src}></img>
                      <aside className="p-sub-like">
                        <button onClick={(e) => this.like(mars)}>
                          <img src="" alt="" />
                        </button>
                      </aside>
                      <aside className="p-sub-row">
                        <h3>Camera: {mars.camera.name} </h3>
                        <h3>Rover: {mars.rover.id} </h3>
                        <h3>Date of Capture: {mars.earth_date} </h3>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <h1></h1>
        )}

        {this.state.epicLiked !== [] ? (
          <main
            className={
              this.state.activeTab === "Liked" ? "active-tab" : "inactive-tab"
            }
          >
            <div className="p-box">
              <div className="p-container">
                {this.state.epicLiked.map((epic, index) => (
                  <section className="p-border">
                    <div>
                      <h1>
                        ID: {epic.identifier} Name:{" "}
                        {RandomName(epic.identifier)}
                      </h1>
                      <img src={this.state.EPICImages[index]}></img>
                      <aside className="p-sub-like">
                        <button onClick={(e) => this.like(epic)}>
                          <img src="" alt="" />
                        </button>
                      </aside>
                      <aside className="p-sub-row">
                        <h3>
                          Centroid Coordinates: {epic.centroid_coordinates.lat}{" "}
                          {", "} {epic.centroid_coordinates.lon}{" "}
                        </h3>
                        <h3>Identifier: {epic.identifier} </h3>
                        <h3>Date of Capture: {epic.date} </h3>
                      </aside>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <h1></h1>
        )} */}

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
                          <img
                            alt={apod.explanation}
                            src={apod.thumbnail_url}
                          ></img>
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
          <span></span>
        )}

        {/* END OF MARS ROVER SECTION */}
        {/*  */}
        {/*  */}
      </div>
    );
  }
}

export default Home;
