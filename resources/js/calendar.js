import { Calendar } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const calendarEl = document.getElementById("calendar");

const calendar = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
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
    alert('selectのイベントです');
  },
  // 予定がある部分をクリック
  eventClick: function (event) {
    alert('eventClickのイベントです')
  },
  // 予定時刻のサイズ変更
  editable: true,  // trueにしないと変更できない
  eventResize: function (event, delta) {
      alert('eventResizeのイベントです');
  },
});

calendar.render();
