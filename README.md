# Nodejs기반 게시판

<img src="./captureImg/메인페이지.PNG"></img>
HTML, CSS, Javascript, Nodejs, MySQL

## 기능

- ### 로그인

  <img src="./captureImg/로그인.PNG"></img>

- ### 회원가입

  <img src="./captureImg/회원가입.PNG"></img>

- ### 글 읽기

  <img src="./captureImg/글 읽기.PNG"></img>

- ### 글 쓰기

  <img src="./captureImg/글 쓰기.PNG"></img>

- ### 글 수정

  <img src="./captureImg/글 수정.PNG"></img>

- ### 글 삭제
  글 삭제 버튼을 눌러 "Title 3" 글을 삭제한 모습
  <img src="./captureImg/글 삭제.PNG"></img>

## 데이터 베이스 테이블 구조

### DB 생성

    create database nodejs_board;

### 유저 테이블 생성

    CREATE TABLE `user_list` (
    `id` char(20) NOT NULL,
    `pw` text(200) NOT NULL,
    `salt` text(200) NOT NULL,
    `nickname` char(20) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

### 글 목록 테이블 생성

    CREATE TABLE `writing_list` (
    `title` char(20) NOT NULL,
    `description` text(200) NOT NULL,
    `writer` char(200) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
