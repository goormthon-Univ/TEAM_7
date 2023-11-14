import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './Calendar.css';
import Lion from '../../assets/images/calendar/lion.png';
import Calendar1 from "../../assets/images/calendar/Calendar1.svg";
import Background from "../../assets/images/calendar/Background.svg";
import { S } from './CalendarStyle';

// 서버에서 받은 images Data
const imageData = [
    { date: "2023-11-01", url: Lion },
    { date: "2023-11-15", url: Lion },
    { date: "2023-11-03", url: Background },
    { date: "2023-11-13", url: Background },
  ];
  
  export default function MyCalendar() {
    const [value, onChange] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [selected, setSelected] = useState(false);
  
    // 월 버튼 클릭 핸들러
    const handleButtonClick = () => {
      setSelected(!selected);
    }
  
    // 월 선택 드롭다운에서 월을 변경했을 때 호출될 함수
    const handleMonthChange = (month) => {
      const year = activeStartDate.getFullYear();
      setActiveStartDate(new Date(year, month));
    };
  
    // 옵션을 생성하는 함수
    const getMonthOptions = () => {
      const options = [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      for (let i = -12; i <= 12; i++) {
        const date = new Date(currentYear, currentMonth + i, 1);
        options.push(
          <S.StyledOptionsList key={i} value={date.getMonth()}>
            <S.StyledOptions onClick={() => 
            { handleMonthChange(date.getMonth());
              handleButtonClick();}}>
              {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </S.StyledOptions>
          </S.StyledOptionsList>
        );
      }
      return options;
    };
  
    // 일요일, 토요일 색상 변경
    const tileClassName = ({ date, view }) => {
      // 달력의 'month' 뷰일 때만 클래스를 적용한다.
      if (view === 'month') {
        if (date.getDay() === 0) { // 일요일
          return 'sunday';
        } else if (date.getDay() === 6) { // 토요일
          return 'saturday';
        }
      }
    };
  
    return (
        <S.Container>
          <S.BackImage>
          <S.CalendarImage src={Calendar1} alt="Calendar1"/>
          <S.CalendarText>Calendar</S.CalendarText>
          <S.StyledSelect onChange={handleMonthChange} onClick={handleButtonClick}>Month</S.StyledSelect>
          <S.StyledOptionsBox show={selected}>
        {getMonthOptions()}
        </S.StyledOptionsBox>
        <S.StyledLeftButton onClick={() => handleMonthChange(activeStartDate.getMonth() - 1)} />
        <S.StyledRightButton onClick={() => handleMonthChange(activeStartDate.getMonth() + 1)} />
        <Calendar
        local="en"
        onChange={onChange} 
        value={value} 
        activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
        tileClassName={tileClassName}
        next2Label={null}
        prev2Label={null}
        nextLabel={null}
        prevLabel={null}
        // 3글자 제한 영어로 설정
        formatShortWeekday={(local, date) => moment(date).format('ddd')}
        formatDay={(local, date) => moment(date).format('D')}
  
        // 날짜 칸에 보여지는 콘텐츠
        tileContent={({ date, view }) => {
      // 날짜에 해당하는 이미지 데이터를 찾는다.
      // moment로 date 내부 데이터에서 day만 빼옴.
      const imageEntry = imageData.find(entry =>
        moment(date).isSame(entry.date, 'day')
      );
  
      // width를 지정하고 height를 auto로 하면 안됌.
      // height를 지정하고 width를 auto로 해야함. 
      if (imageEntry) {
        // Inline style for dynamic background image
        const style = {
          width: 'auto',
          height: '6rem',
        };
  
      // 해당하는 이미지 데이터가 있다면 이미지 태그를 생성한다.
      return (
        <div className="report-image" style={style} ><S.DayImage src={imageEntry.url}/></div>
      );
    }
    // 사진 파일이 없으면 기본으로
    else {
      const style = {
        width: 'auto',
        height: '6rem',
      };
  
      return (
        <div className="report_image" style={style} />
      );
    }
  }}
  />
  
  <S.AddBarcord>바코드 생성</S.AddBarcord>
  
  </S.BackImage>
        </S.Container>
    );
  }
  