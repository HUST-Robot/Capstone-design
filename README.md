# Capstone-design

![KakaoTalk_20191208_190953699](https://user-images.githubusercontent.com/9815703/70439086-91375b80-1ad2-11ea-8cdf-ba4c3953d8dd.jpg)

## Project Name : Smart Mirror 
## Introduction
사용자가 시간과 노력을 들이지 않아도 일상생활 정보를 시각적으로 확인할 수 있으며, 산업 현장에서는 간편한 모니터링 목적으로도 응용 가능한 스마트 디바이스를 제작한다.

## 기능 
### Smart Mirror
[Magic Mirror2](https://magicmirror.builders/) Open Source code 바탕으로 제작  

### 아두이노 인체감지 센서 
인체 감지 센서를 이용하여 사용자를 감지하여 Mirror 테두리 무드등 기능 

### 음성인식 
구글 / 아마존 음성인식 이용 예정 

### 사용 한 모듈 종류 및 변경사항
1. 시계 [Clock](https://github.com/MichMich/MagicMirror/tree/master/modules/default/clock)
2. 날씨 [Weather Forecast](https://github.com/MichMich/MagicMirror/tree/master/modules/default/weatherforecast)
  - 변경사항 : 날씨 아이콘 이미지 변경
3. 얼굴인식 [MMM-Facial-Recognition-OCV3](https://github.com/normyx/MMM-Facial-Recognition-OCV3)
  - 변경사항 : 얼굴 인식 성공시 (Module: Alert) 모듈을 추가하여 노티피케이셔 알람 설정 
4. 할일 [MMM-Wunderlist](https://github.com/paviro/MMM-Wunderlist)
5. 디버깅 확인을 위한 로그모듈 [MMM-Logging](https://github.com/shbatm/MMM-Logging)

### 작업내역 
백그라운드 이미지 변경 / 날씨 이모티콘 변경 / 아두이노 센서를 이용한 LED 제어 / 셋톱박스 프레임 제작 (catia 작업 -> 3D프린팅) 

### 작업 일정 
개발일정 |  내용  
:---: | ---  
2019-12-09 | Capstone-design Project start
2019-12-11 | Capstone-design 아이디어 회의 / 주제 선정 / 주제 스마트 미러 
2019-12-13 | 11일 ~ 13일까지 : 프레임 제작을 위한 설계 작업 수행 
2019-12-16 | 16일 ~ 20일까지 : 필요 모듈 테스트 및 환경구축 (시계 / 날씨 / 얼굴인식 / 할일 / 디버깅 로그 모듈 설정) 수행 
2020-01-03 | Capstone-design Project end 


사용 언어 : 자바 스크립트 CSS HTML 파이썬

제작 인원 : 3명 

제작 기간 : 4주

Team 
협업 방식 : 주 1회 스프린트 미팅, Daily Scrum으로 매일(평일) 개발 상황 공유  
협업 도구 : Google docs, GitHumb  

#### 개발 운영 환경 및 관련 사항 
- [라즈베리파이 Open CV 설치 방법](https://github.com/HUST-Robot/Capstone-design/issues/3)

#### 설계이슈
