import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/SarahColbath-UCSD-Student/DSC106_portfolio/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: true,
        enumerable: false,
        writable: true,
        
        // What other options do we need to set?
        // Hint: look up configurable, writable, and enumerable
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  // Create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Add total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Add total commits
  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  // Add more stats as needed...
  let avg_time = d3.mean(data, d => (d.datetime.getHours() + d.datetime.getMinutes() / 60));
  let timestamp = '';
  if (avg_time > 12) {
    timestamp = 'PM';
    avg_time = avg_time - 12;
  }
  else {
    timestamp = 'AM';
  }
  dl.append('dt').html('Most active time');
  let new_date = new Date();
  new_date.setHours(avg_time);
  dl.append('dd').text(`${new_date.getHours()}:${new_date.getMinutes()} ${timestamp}`);

  dl.append('dt').html('Last Commit');
  let time_since_last = d3.min(data, d => (Date.now() - d.datetime));
  console.log(Date(time_since_last));
  dl.append('dd').text()
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);