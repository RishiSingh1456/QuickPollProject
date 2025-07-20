let pollData = null;

function createPoll() {
  const question = document.getElementById('question').value.trim();
  const options = document.getElementById('options').value.split(',').map(opt => opt.trim()).filter(Boolean);

  if (!question || options.length < 2) {
    alert("Enter a question and at least two options.");
    return;
  }

  pollData = {
    question,
    options,
    votes: new Array(options.length).fill(0)
  };

  localStorage.setItem('quickPoll', JSON.stringify(pollData));
  showPoll();
}

function showPoll() {
  const pollArea = document.getElementById('poll-area');
  const storedPoll = JSON.parse(localStorage.getItem('quickPoll'));
  if (!storedPoll) {
    pollArea.innerHTML = "<p>No poll created yet.</p>";
    return;
  }

  pollData = storedPoll;

  let html = `<h2>${pollData.question}</h2>
              <form id="poll-form">`;

  pollData.options.forEach((opt, index) => {
    html += `<div class="option">
               <label><input type="radio" name="poll" value="${index}"> ${opt}</label>
             </div>`;
  });

  html += `<button type="submit">Vote</button></form><div id="results"></div>`;

  pollArea.innerHTML = html;

  document.getElementById('poll-form').addEventListener('submit', votePoll);
}

function votePoll(e) {
  e.preventDefault();
  const choice = document.querySelector('input[name="poll"]:checked');
  if (!choice) return alert("Please select an option");

  const index = parseInt(choice.value);
  pollData.votes[index]++;
  localStorage.setItem('quickPoll', JSON.stringify(pollData));
  showResults();
}

function showResults() {
  const totalVotes = pollData.votes.reduce((a, b) => a + b, 0);
  let resultHtml = "<h3>Results:</h3>";

  pollData.options.forEach((opt, i) => {
    const count = pollData.votes[i];
    const percent = totalVotes ? ((count / totalVotes) * 100).toFixed(1) : 0;
    resultHtml += `<p>${opt}: ${count} vote(s) (${percent}%)</p>`;
  });

  document.getElementById('results').innerHTML = resultHtml;
}

window.onload = showPoll;
