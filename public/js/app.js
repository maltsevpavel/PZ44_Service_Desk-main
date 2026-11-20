const form = document.querySelector("#ticket-form");
const list = document.querySelector("#ticket-list");
const status = document.querySelector("#status");
const summary = document.querySelector("#summary");
const refreshButton = document.querySelector("#refresh-button");
const sendButton = document.querySelector("#send-button");
function setStatus(text, kind = "info") {
  status.textContent = text;
  status.dataset.kind = kind;
}
function renderTickets(items) {
  // TODO 1: очистите list и создайте карточку каждого обращения через createElement/textContent.
  // В карточке нужны номер #id, имя, текст проблемы и статус.
}
async function loadTickets() {
  // TODO 2: GET /api/tickets → проверка response.ok → response.json() → renderTickets(data.items).
  // Отобразите data.total в #summary; ошибки покажите через setStatus().
  setStatus("TODO: выполните GET-запрос");
}
async function createTicket(payload) {
  // TODO 3: POST /api/tickets с заголовком Content-Type: application/json.
  // Передайте JSON.stringify(payload); проверьте код ответа и прочитайте JSON.
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // TODO 4: проверьте данные, отключите sendButton на период запроса,
  // вызовите createTicket(), очистите поля после успеха и обновите список через GET.
  setStatus("TODO: обработайте отправку формы");
});
refreshButton.addEventListener("click", loadTickets);
// TODO 5: вызовите loadTickets() при загрузке страницы.
