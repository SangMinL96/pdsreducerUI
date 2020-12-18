import React from 'react';
import styled from 'styled-components';

import moment from 'moment';

function NoticeList({ title, dates }) {
  let today = new Date();
  let formetToday = moment(today).format('YYYY-MM-DD');
  let formetDates = moment(dates,"YYYY MM DD").format('YYYY-MM-DD');

  return (
    <NoticeListContainer>
      <NoticeLists>
        <TitleContents>
          <NewNotice> {formetToday !== formetDates ? null : 'New'}</NewNotice>
          <h5>asdfdasfasdfas</h5>
        </TitleContents>
        <div>{formetDates}</div>
      </NoticeLists>
    </NoticeListContainer>
  );
}
export default NoticeList;
const NoticeListContainer = styled.ul`
  width: 80%;
  font-size: 0.9rem;
  margin-left: 2em;
  margin-top: 0.8em;
`;
const NoticeLists = styled.li`
  display: flex;
  justify-content: space-between;

  div {
    font-size: 0.8rem;
  }
`;
const TitleContents = styled.div`
  display: flex;
  h5 {
    width: 100px;
    font-size: 0.9rem;
  }
`;
const NewNotice = styled.div`
  color: red;
  width: 45px;
`;
