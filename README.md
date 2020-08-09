# Restful api 게시판 
사용 스택 Nodejs, MySQL 

#기능 

로그인, 회원가입
글 쓰기, 글 수정, 글 삭제


#DB - MySQL 

create database free_board; // DB 생성 

CREATE TABLE `user_list` ( // 유저 테이블 생성 
    `id` char(20) NOT NULL,
    `pw` text(200) NOT NULL,
    `salt` text(200) NOT NULL,
    `nickname` char(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user_list(id, pw, salt, nickname)  // 회원가입 
VALUES ("sample", "sample", "sample","sample");

CREATE TABLE `writing_list` ( // 글 목록 테이블 생성 
    `title` char(20) NOT NULL,
    `description` text(200) NOT NULL,
    `writer` char(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO writing_list(title, description, writer) // 글 쓰기 
VALUES ("sample", "sample", "sample");