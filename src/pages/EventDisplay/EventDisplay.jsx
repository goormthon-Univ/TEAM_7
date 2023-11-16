import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventHeader from "../../components/EventHeader/EventHeader";
import EventParticipants from "../../components/EventParticipants/EventParticipants";
import EventUploadList from "../../components/EventUploadList/EventUploadList";
import "./EventDisplay.css";
import BarcodeLoading from "../../components/BarcodeLoading/BarcodeLoading";
import { useDispatch, useSelector } from "react-redux";
import { setEventList } from "../../redux/eventListSlice";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const EventDisplay = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.eventList);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  let stompClient = null;

  const connectWebSocket = () => {
    const socket = new SockJS("/ws-button");
    stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      function (frame) {
        console.log("Connected: " + frame);
        stompClient.subscribe(`/subscribe/button/${id}`, function (message) {
          const messageBody = JSON.parse(message.body);
          setButtonEnabled(messageBody.buttonStatus);
        });
      },
      function (error) {
        console.error("WebSocket error:", error);
      }
    );
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
  }, [id]); // id가 변경될 때마다 연결을 재설정합니다.

  // 바코드 생성 핸들러
  const handleBarcodeGeneration = async () => {
    if (buttonEnabled) {
      try {
        const response = await axios.post(`/api/v1/event/${id}/result`);
        console.log("Barcode generated successfully:", response.data);
      } catch (error) {
        console.error("Error in generating barcode:", error);
      }
    } else {
      console.log("Barcode generation button is disabled.");
    }
  };

  return (
    <>
      <div className="eventDisplayWrap">
        <EventHeader />
        <EventParticipants />
        <EventUploadList
          userInfo={users.userInfo}
          loginUserId={users.loginUserId}
        />
        {users.isRoomMaker && (
          <div className="makeBarcode">
            <button
              className="makeBarcodeBtn"
              onClick={handleBarcodeGeneration}
              disabled={!buttonEnabled}
            >
              무코 생성
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDisplay;
