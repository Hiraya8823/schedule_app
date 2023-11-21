import { Calendar } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import momentPlugin from "@fullcalendar/moment";

const calendarEl = document.getElementById("calendar");

const calendar = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin],
  // ナビゲーション
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  // 日本語化
  locales: jaLocale,
  locale: 'ja',

  // 日付表示の境界線時刻を設定
  nextDayThreshold: '00:00:00',

  events: '/calendar/action',

  // 予定がない部分をクリック
  selectable: true,  // trueにしないと選択できない
  select: function (start, end, allDay) {
    createModal(start);
  },
  // 予定がある部分をクリック
  eventClick: function (event) {
    // クリックしたイベントとイベントのイベントで入れ子
    editModal(event.event);
  },
  // 予定時刻のサイズ変更
  editable: true,  // trueにしないと変更できない
  eventResize: function (event, delta) {
      alert('eventResizeのイベントです');
  },
});

calendar.render();

const modal = document.getElementById("modal-id");
const modalBg = document.getElementById("modal-id-bg");
const addButton = document.getElementById('add-button');
const updateButton = document.getElementById('update-button');
const closeModalButton = document.getElementById('cancel-button');
const deleteButton = document.getElementById('delete-button');
const modalForm = document.getElementById('modal-form');

const formId = modalForm.querySelector('input[name="id"]');
const formAllDay = modalForm.querySelector('input[name="all_day"]');
const formStartDate = modalForm.querySelector('input[name="start_date"]');
const formStartTime = modalForm.querySelector('input[name="start_time"]');
const formEndDate = modalForm.querySelector('input[name="end_date"]');
const formEndTime = modalForm.querySelector('input[name="end_time"]');
const formTitle = modalForm.querySelector('input[name="title"]');
const formBody = modalForm.querySelector('textarea[name="body"]');

function toggleModal(){
  modal.classList.toggle("hidden");
  modal.classList.toggle("flex");
  modalBg.classList.toggle("hidden");
  modalBg.classList.toggle("flex");
}

// フォームの入力で表示更新
modalForm.addEventListener('input', updateForm);
modalForm.addEventListener('change', updateForm);

// フォームの表示更新
function updateForm(){
  // 終日のチェックでフォーム切り替え
  const isAllDay = formAllDay.Checked;
  if(isAllDay){
    formStartTime.classList.add('hidden');
    formStartTime.required = false;
    formEndTime.classList.add('hidden');
    formEndTime.required = false;
  } else {
    formStartTime.classList.remove('hidden');
    formStartTime.required = true;
    formEndTime.classList.remove('hidden');
    formEndTime.required = true;
  }
  // 入力チェックでボタンの有効/無効
  const isRequired = modalForm.checkValidity();
  addButton.disabled = isRequired ? false :true;
  updateButton.disabled = isRequired ? false : true;
}

// 登録時のモーダル設定
function createModal(start){
  console.log("createModal");

  // フォームの初期化
  modalForm.reset();

  // フォームの初期値を設定
  formStartDate.value = start.startStr;
  formStartTime.value = "09:00:00";
  formEndDate.value = start.startStr;
  formEndTime.value = "10:00:00";
  formTitle.value = "";
  formBody.value = "";

  // ボタンの表示/非表示
  updateButton.classList.add('hidden');
  deleteButton.classList.add('hidden');
  addButton.classList.remove('hidden');

  // フォームの状態に合わせて表示を更新
  updateForm();
  // モーダル表示
  toggleModal();
}

// 編集時のモーダル処理
function editModal(event){
  console.log("editModal");

  // フォームのsyokika
  modalForm.reset();

  formId.value = event.id;
  formAllDay.checked = event.allDay;
  formStartDate.value = calendar.formatDate(event.start, 'YYY-MM-DD');
  formStartTime.value = event.allDay ? "" : calendar.formatDate(event.start, 'HH:mm:ss');

}

// 登録ボタンの処理
addButton.addEventListener('click', function(){
  console.log("addButton");
  const isAllDay = formAllDay.checked;
  const data = {
    title: formTitle.value,
    body: formBody.value,
    start: isAllDay ? formStartDate.value : formStartDate.value + ' ' + formStartTime.value,
    end: isAllDay ? formEndDate.value : formEndDate.value + ' ' + formEndTime.value,
    type: 'add'
  };
  axios.post('/calendar/action', data)
    .then((response) => {
      // 予定をカレンダーに追加
      calendar.addEvent(response.data);

      toggleModal();
    });
})

// キャンセルボタンの処理
closeModalButton.addEventListener('click', function(){
  toggleModal();
});
