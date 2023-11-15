-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 15, 2023 at 05:25 PM
-- Server version: 5.7.44
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `note` text,
  `image_url` varchar(255) DEFAULT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `note`, `image_url`, `last_modified`, `user_id`) VALUES
(34, 'Time is over', 'Olivia wilson', 'A Heart That Works is heartbreaking (and how can it not be?), but it’s also an affecting portrait of a father’s love for his son. Delaney traces everything that happened to Henry, from his diagnosis through his death, and how his family came together in the midst of it all.', '/uploads/1699982920651-Brown Vintage Style Mystery Novel Book Cover.png', '2023-11-14 17:28:41', 2),
(35, 'Soul', 'Olivia wilson', 'Delaney traces everything that happened to Henry, from his diagnosis through his death, and how his family came together in the midst of it all.', '/uploads/1699884750757-Brown Mystery Novel Book Cover.png', '2023-11-13 14:12:31', 2),
(36, 'Soul', 'Olivia wilson', 'nice book', '/uploads/1699880600769-Brown Rusty Mystery Novel Book Cover.png', '2023-11-13 13:03:21', 2),
(37, 'scarf', 'Olivia wilson', 'About life and love', '/uploads/1699923255353-mon.png', '2023-11-14 00:54:15', 2),
(38, 'Monarch', 'Olivia wilson', 'war and woman', '/uploads/1699923317654-scarf.png', '2023-11-14 00:55:17', 2),
(39, 'Widow', 'Harry wilson', 'A story of a widow', '/uploads/1699923440484-widow.png', '2023-11-14 00:57:20', 2);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `review` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `book_id`, `user_id`, `rating`, `review`, `created_at`) VALUES
(19, 34, 2, 5, 'I  love this book its really good one', '2023-11-14 16:17:15'),
(20, 34, 2, 5, 'nice work', '2023-11-14 17:17:51'),
(21, 37, 2, 5, 'love it', '2023-11-15 09:42:34'),
(22, 34, 2, 5, 'hi', '2023-11-15 09:56:44'),
(23, 34, 2, 5, 'ok', '2023-11-15 10:30:58'),
(24, 34, 2, 2, '', '2023-11-15 10:31:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bio` text,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `favorite_genre` varchar(255) DEFAULT NULL,
  `unique_id` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `created_at`, `bio`, `profile_pic_url`, `favorite_genre`, `unique_id`) VALUES
(2, 'osama', '2023-11-11 14:21:32', 'hi', '/uploads/user-1699902779381-osama.jpg', 'love', '86ccbc4964cef2fa'),
(3, 'wilson', '2023-11-14 22:07:10', 'love', '/uploads/user-1699999630414-OSAMA1.jpg', 'love', '704b6b18b5bb6fc6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
