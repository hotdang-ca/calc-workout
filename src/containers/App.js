import React, { Component } from 'react';
import qs from 'qs';
import { calcZones, calcPercentages } from 'ftp-calc';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ftp: undefined,
      hr: undefined,
      zones: {},
      percentages: {},
    };
  }

  handleFTPChanged(e) {
    this.setState({
      ftp: e.target.value,
    });
  }

  handleHRChanged(e) {
    this.setState({
      hr: e.target.value,
    });
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    const params = qs.parse(window.location.search.split('?')[1]);
    if (!params) {
      return;
    }

    const { ftp, hr } = params;
    this.setState({
      ftp,
      hr,
    });

    if (ftp) {
      this.ftpInput.value = ftp;
    }

    if (hr) {
      this.hrInput.value = hr;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { ftp, hr } = this.state;
    if (
      (ftp !== prevState.ftp)
      || (hr !== prevState.hr)
    ) {
      if ((ftp && hr ) || (ftp && hr === 0)) {
        this.setState({
          zones: calcZones(ftp, hr),
          percentages: calcPercentages(ftp, '50,60,70,80,90'),
        });

        if (typeof window === 'undefined') {
          return;
        }
        // TODO: make this change the URL but without updating the page
        window.history.replaceState({ftp, hr }, `Zones calculation for ${ftp} FTP`, `/?${qs.stringify({ftp, hr})}`);
      }
    }
  }

  renderZones(zones) {
    if (!zones || !zones.Zone1) {
      return null;
    }

    const { Zone1, Zone2, Zone3, Zone4, Zone5, Zone6 } = zones;
    const zonesArray = [Zone1, Zone2, Zone3, Zone4, Zone5, Zone6];

    return zonesArray.map((zone) => {
      return (
        <div
          key={zone.short}
          style={{
            width: '80%',
            border: '1px solid gray',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 24px',
            margin: '16px auto',
          }}
        >
          <div>
            <h2>{ zone.name }</h2>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            margin: '8px auto',
          }}>
            <div style={{
              border: '2px solid #000',
              padding: 5,
              margin: 'auto 5px',
            }}>
              <big>{zone.short}</big>
            </div>
            <div style={{
              padding: 5,
              margin: 'auto 5px',
              }}
            >
              <strong>Wattage Range</strong>: <span>{ zone.avgPower && zone.avgPower.low || ''} ~ { zone.avgPower && zone.avgPower.high }</span>
            </div>
            <div style={{
              padding: 5,
              margin: 'auto 5px',
              }}
            >
              <strong>Heart Rate Range</strong>: <span>{ zone.avgHr && zone.avgHr.low || ''} ~ { zone.avgHr && zone.avgHr.high }</span>
            </div>
          </div>

          <div style={{ margin: '8px auto'}}>
            { zone.desc }
          </div>
          <div style={{ margin: '8px auto'}}>
            <small>{ zone.benefits }</small>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: '#252526',
            padding: 16,
            width: '100%',
            color: 'white',
            position: 'fixed',
            top: 0,
            height: 80,
          }}>
          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            Input your Average Functional Threshold Power &amp; Max Heart Rate:
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              ref={(input) => { this.ftpInput = input; }}
              onChange={this.handleFTPChanged.bind(this)}
              placeholder="Average FTP"
              style={{
                color: 'white',
                borderBottom: '1px solid white',
                backgroundColor: '#333333',
                borderLeft: 'none',
                borderTop: 'none',
                borderRight: 'none',
                fontSize: '1.2rem',
                margin: '6px 12px',
                padding: 8,
                height: 32,
                width: '33%',
              }}
            /><br/>
            <input
              ref={(input) => { this.hrInput = input; }}
              onChange={this.handleHRChanged.bind(this)}
              placeholder="Max HR"
              style={{
                color: 'white',
                borderBottom: '1px solid white',
                backgroundColor: '#333333',
                borderLeft: 'none',
                borderTop: 'none',
                borderRight: 'none',
                fontSize: '1.2rem',
                margin: '6px 12px',
                padding: 8,
                height: 32,
                width: '33%',
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 150 }}>
          { this.renderZones(this.state.zones) }
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 16,
          }}>
            <span>Uses <a href="https://www.npmjs.com/package/ftp-calc" target="_blank">ftp-calc</a>, by James Robert Perih.</span>
            <span>Copyright &copy; 2018, James Robert Perih, <a href="mailto:james@hotdang.ca">james@hotdang.ca</a></span>
            <span>More at <a href="https://hotdang.ca/">HotDang Interactive</a>.</span>
          </div>
        </div>
      </div>
    );
  }
}
