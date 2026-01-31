--
-- PostgreSQL database dump
--

\restrict 7Zh3026fae6x23J5a5OhMajtSHJ4Iur5kigGhCgbgRUloTMH9MwEyRPtpNRArwK

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: meters_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.meters_type_enum AS ENUM (
    'cold_water',
    'hot_water',
    'gas',
    'electricity'
);


ALTER TYPE public.meters_type_enum OWNER TO postgres;

--
-- Name: news_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.news_category_enum AS ENUM (
    'normal',
    'planned',
    'urgent'
);


ALTER TYPE public.news_category_enum OWNER TO postgres;

--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'pending',
    'paid',
    'overdue'
);


ALTER TYPE public.payments_status_enum OWNER TO postgres;

--
-- Name: payments_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_type_enum AS ENUM (
    'utilities',
    'maintenance',
    'heating',
    'water',
    'electricity',
    'gas',
    'other'
);


ALTER TYPE public.payments_type_enum OWNER TO postgres;

--
-- Name: requests_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.requests_status_enum AS ENUM (
    'new',
    'assigned',
    'accepted',
    'in_progress',
    'completed',
    'rejected',
    'closed',
    'disputed'
);


ALTER TYPE public.requests_status_enum OWNER TO postgres;

--
-- Name: requests_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.requests_type_enum AS ENUM (
    'plumbing',
    'electricity',
    'heating',
    'cleaning',
    'repair',
    'other'
);


ALTER TYPE public.requests_type_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'resident',
    'manager',
    'executor',
    'admin'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    address character varying NOT NULL,
    "yearBuilt" integer,
    floors integer,
    entrances integer,
    "totalApartments" integer,
    "wallMaterial" character varying,
    "houseRules" text,
    tariffs jsonb,
    "managementCompany" jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "accountNumber" character varying
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- Name: meters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    "apartmentNumber" character varying NOT NULL,
    type public.meters_type_enum NOT NULL,
    "serialNumber" character varying NOT NULL,
    "verificationDate" date,
    "nextVerificationDate" date,
    "currentReading" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "previousReading" numeric(10,2),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "accountNumber" character varying,
    "electricityAccountNumber" character varying,
    "currentReadingT1" numeric(10,2),
    "currentReadingT2" numeric(10,2),
    "currentReadingT3" numeric(10,2),
    "previousReadingT1" numeric(10,2),
    "previousReadingT2" numeric(10,2),
    "previousReadingT3" numeric(10,2)
);


ALTER TABLE public.meters OWNER TO postgres;

--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "authorId" character varying,
    title character varying NOT NULL,
    content text NOT NULL,
    "imageUrl" character varying,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    category public.news_category_enum DEFAULT 'normal'::public.news_category_enum NOT NULL,
    "publishedAt" timestamp without time zone,
    "expiresAt" timestamp without time zone,
    "isPinned" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_buildings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "newsId" uuid NOT NULL,
    "buildingId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news_buildings OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    type public.payments_type_enum NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.payments_status_enum DEFAULT 'pending'::public.payments_status_enum NOT NULL,
    period character varying NOT NULL,
    description character varying,
    "dueDate" date NOT NULL,
    "paidDate" date,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    type public.requests_type_enum NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    status public.requests_status_enum DEFAULT 'new'::public.requests_status_enum NOT NULL,
    "apartmentNumber" character varying,
    "buildingAddress" character varying,
    response text,
    "assignedTo" character varying,
    "assignedPosition" character varying,
    deadline timestamp without time zone,
    "estimatedCost" numeric(10,2),
    "isFree" boolean DEFAULT false NOT NULL,
    "estimateDetails" text,
    "residentApproval" boolean,
    "executorComment" text,
    "residentComment" text,
    "photosBefore" text,
    "photosAfter" text,
    "isPaid" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "completedAt" timestamp without time zone,
    "executorId" character varying,
    "executorAccepted" boolean DEFAULT false NOT NULL,
    "executorRejected" boolean DEFAULT false NOT NULL,
    "executorRejectionReason" text,
    "finalCost" numeric(10,2),
    "residentRejectionReason" text,
    "executorRating" integer,
    "closedAt" timestamp without time zone
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: user_news_read; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_news_read (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    "newsId" character varying NOT NULL,
    "readAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_news_read OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "middleName" character varying,
    phone character varying,
    role public.users_role_enum DEFAULT 'resident'::public.users_role_enum NOT NULL,
    "apartmentNumber" character varying,
    "buildingAddress" character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "position" character varying,
    "photoUrl" character varying,
    rating numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    "ratingsCount" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buildings (id, address, "yearBuilt", floors, entrances, "totalApartments", "wallMaterial", "houseRules", tariffs, "managementCompany", "createdAt", "updatedAt", "accountNumber") FROM stdin;
aad04667-f1d2-44ad-922b-37a6b8856f67	119002, Москва, пер. Сивцев Вражек 31/13	1956	5	2	40	Кирпич	Правила проживания будут добавлены администратором	{"gas": 7.89, "hotWater": 215.30, "coldWater": 42.50, "electricity": {"day": 7.22, "peak": 8.40, "night": 4.65}}	{"name": "УК Отта", "email": "info@otta.ru", "phone": "+7 (495) 123-45-67", "address": "Москва, ул. Примерная, д. 1", "workingHours": "Пн-Пт: 9:00-18:00"}	2026-01-27 11:15:38.909601	2026-01-27 11:15:38.909601	119002-001234
75252c83-4f0f-4ece-95f1-4ebea5bfaa38	119034, Москва, Большой Власьевский пер., 15	1962	6	3	72	Кирпич	\N	\N	\N	2026-01-30 16:39:34.833026	2026-01-30 16:39:34.833026	119034-001567
6a108068-4f8a-4923-9acd-4160aa75c988	119121, Москва, ул. Плющиха, 42	1978	9	4	144	Панель	\N	\N	\N	2026-01-30 16:40:07.098706	2026-01-30 16:40:07.098706	119121-002891
\.


--
-- Data for Name: meters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.meters (id, "userId", "apartmentNumber", type, "serialNumber", "verificationDate", "nextVerificationDate", "currentReading", "previousReading", "createdAt", "updatedAt", "accountNumber", "electricityAccountNumber", "currentReadingT1", "currentReadingT2", "currentReadingT3", "previousReadingT1", "previousReadingT2", "previousReadingT3") FROM stdin;
6ed75874-1e5d-4171-9d3c-e0b152275d72	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	12	hot_water	ГВС-2024-005678	2023-06-15	2029-06-15	89.20	84.10	2026-01-27 11:15:38.911641	2026-01-27 11:15:38.911641	\N	\N	\N	\N	\N	\N	\N	\N
a8d6b313-711d-4cff-b515-6c91cb287040	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	12	cold_water	ХВС-2024-001235	2023-06-15	2029-06-15	98.40	92.20	2026-01-27 11:36:22.88515	2026-01-27 11:36:22.88515	\N	\N	\N	\N	\N	\N	\N	\N
acea38e4-b52c-49bf-bc09-af70f0ce7fcc	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	12	hot_water	ГВС-2024-005679	2023-06-15	2029-06-15	67.80	63.50	2026-01-27 11:36:22.88515	2026-01-27 11:36:22.88515	\N	\N	\N	\N	\N	\N	\N	\N
39bdbaf5-4f08-4f25-bdd2-7bcaef52d61e	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	12	cold_water	ХВС-2024-001234	2023-06-15	2029-06-15	130.00	125.50	2026-01-27 11:15:38.911641	2026-01-27 14:01:00.748678	\N	\N	\N	\N	\N	\N	\N	\N
b160440a-895c-4682-84f2-a8b2e633626b	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	12	electricity	ЭЛ-2024-009999	2022-08-20	2038-08-20	8542.00	8342.00	2026-01-27 11:15:38.911641	2026-01-27 14:01:44.883408	\N	119002-001234-EL	3600.00	2950.00	2200.00	3542.00	2800.00	2200.00
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, "authorId", title, content, "imageUrl", "isPublished", "createdAt", "updatedAt", category, "publishedAt", "expiresAt", "isPinned") FROM stdin;
40a65b48-c3ca-4def-b9f6-4ba6a6be6807	\N	Масленица во дворе	Приглашаем всех на празднование 10 марта с 12:00 до 15:00	\N	t	2026-01-29 13:53:35.787757	2026-01-29 13:53:35.787757	normal	2026-01-29 13:53:35.787757	\N	f
322e67ef-9ad3-4447-8e7f-23711144450f	\N	Плановое отключение воды	Уважаемые жители! 5 февраля с 10:00 до 16:00 будет отключена холодная вода	\N	t	2026-01-29 13:53:35.787757	2026-01-29 13:53:35.787757	planned	2026-01-29 13:53:35.787757	\N	f
5c2ca811-e200-40f6-8815-f38e9cb50de0	\N	ВНИМАНИЕ! Прорыв трубы отопления	В подъезде номер 2 произошел прорыв трубы. Аварийная бригада выехала. Не пользуйтесь лифтом!	\N	t	2026-01-29 13:53:35.787757	2026-01-29 13:53:35.787757	urgent	2026-01-29 13:53:35.787757	\N	t
9d2be293-ba09-47e6-a9d3-bbdcd12858bf	\N	Замена лифта	с 26.08-15.09 в вашем доме будет производится замена пассажирского лифта. 	\N	t	2026-01-30 13:34:29.501961	2026-01-30 13:34:29.501961	planned	2026-01-30 16:34:29.487	\N	f
3717f619-0365-4732-bb46-dd92027301b5	\N	Пасха 2026	Пасхальные молебен и овящение яиц и куличей пройдут в Церкви Святого Власия на Большом Власьевком переулке. 	\N	t	2026-01-30 18:41:26.673163	2026-01-30 18:41:26.673163	normal	2026-01-30 21:41:26.643	\N	f
\.


--
-- Data for Name: news_buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_buildings (id, "newsId", "buildingId", "createdAt") FROM stdin;
ebb51eca-d463-4d03-b051-ee93aaf03fec	3717f619-0365-4732-bb46-dd92027301b5	75252c83-4f0f-4ece-95f1-4ebea5bfaa38	2026-01-30 18:41:26.673163
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "userId", type, amount, status, period, description, "dueDate", "paidDate", "createdAt") FROM stdin;
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, "userId", type, title, description, status, "apartmentNumber", "buildingAddress", response, "assignedTo", "assignedPosition", deadline, "estimatedCost", "isFree", "estimateDetails", "residentApproval", "executorComment", "residentComment", "photosBefore", "photosAfter", "isPaid", "createdAt", "updatedAt", "completedAt", "executorId", "executorAccepted", "executorRejected", "executorRejectionReason", "finalCost", "residentRejectionReason", "executorRating", "closedAt") FROM stdin;
27ce4460-ec1c-41a8-9399-c342546558cc	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	plumbing	Замена крана в ванной комнате	Заменить смеситель на новый	closed	42	ул. Ленина, 10	Заявка принята. Сантехник Сергеев Сергей будет у вас в 11.00. 	Сергеев С.С.	Сантехник	2026-01-27 08:00:00	3200.00	f	Смеситель с душем	t	Работа выполнена. Дополнительно замена фиттинга трубы. 	Хорошо	\N	\N	f	2026-01-26 13:35:35.129316	2026-01-26 14:33:00.991446	2026-01-26 17:09:32.208	1abe8e87-436f-4345-916a-5a242fefa62a	t	f	\N	4200.00	\N	4	2026-01-26 17:33:00.968
c75e1baa-dd8e-4feb-8478-6daf91493b10	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	plumbing	Протечка в ванной 	Протекает канализационный стояк в ванной.	closed	42	ул. Ленина, 10	Заявка принята. Сантехник выедет завтра утром.	Сергеев С.С.	Сантехник	2026-01-26 04:00:00	5000.00	f	Канализационная труба + работа 	t	Работа выполнена. Замена канализационной трубы. 	Удовлетворительно	\N	\N	f	2026-01-25 15:43:07.136147	2026-01-26 14:33:07.263165	2026-01-26 16:14:37.792	1abe8e87-436f-4345-916a-5a242fefa62a	t	f	\N	10000.00	\N	3	2026-01-26 17:33:07.252
\.


--
-- Data for Name: user_news_read; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_news_read (id, "userId", "newsId", "readAt") FROM stdin;
114a0ce4-ce5f-4fa7-9675-14475e0acb9a	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	5c2ca811-e200-40f6-8815-f38e9cb50de0	2026-01-30 12:26:26.269112
c3fc4085-ac62-4971-916a-c5fe68575d28	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	40a65b48-c3ca-4def-b9f6-4ba6a6be6807	2026-01-30 12:26:26.279183
75f629db-3944-42e7-b0a9-ead496c824ec	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	322e67ef-9ad3-4447-8e7f-23711144450f	2026-01-30 12:26:26.283496
93219f88-61e3-449b-9e18-5f0d9dafb5dd	e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	9d2be293-ba09-47e6-a9d3-bbdcd12858bf	2026-01-30 13:36:45.564319
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", "middleName", phone, role, "apartmentNumber", "buildingAddress", "isActive", "createdAt", "position", "photoUrl", rating, "ratingsCount", "updatedAt") FROM stdin;
33245031-e141-43a1-9c17-cd143796c980	manager@uk.ru	$2b$10$bjZdQ4UYGWgeBe/fODPCouKatXCSF.vKhvcSxk8.iQcYZpBHxO7gK	Анна	Иванова	\N	\N	manager	\N	\N	t	2026-01-25 15:41:03.637132	\N	\N	0.00	0	2026-01-25 19:58:54.429125
00a6c418-b4f6-4b28-a007-56eb18e6b74e	ivanov@executor.ru	$2b$10$ovNncJ08z3/lVO0bNbm3nuAjHVwWycxRMMh7YVphwwJwbZqGXFNqG	Иван	Иванов	Иванович	+7 (999) 123-45-67	executor	\N	\N	t	2026-01-25 20:04:38.563931	Сантехник	\N	0.00	0	2026-01-25 20:04:38.563931
1ae2ddae-b1e7-4385-96b5-bbe8a7b0e729	petrov@executor.ru	$2b$10$2ectGazflBLL0KzshntcS.Dmabp47AN0xObo2PVQDBkrDQ2w4unSy	Пётр	Петров	Петрович	+7 (999) 234-56-78	executor	\N	\N	t	2026-01-25 20:04:38.620718	Электрик	\N	0.00	0	2026-01-25 20:04:38.620718
1aaab8c0-d3f8-44de-bd3b-8d892dd9f4ed	sidorov@executor.ru	$2b$10$Phgs2G4K.vEzx0VQrgaSI.ouUNnQHKLvAlwfsMvNrVqv9A2wncCxO	Сидор	Сидоров	Сидорович	+7 (999) 345-67-89	executor	\N	\N	t	2026-01-25 20:04:38.671895	Слесарь	\N	0.00	0	2026-01-25 20:04:38.671895
1abe8e87-436f-4345-916a-5a242fefa62a	executor@test.ru	$2b$10$anbfF7xecmHD/5TXEiCCkOqQW5QrJiooQxootCfjb5fK.VCWDw40q	Сергей	Сергеев	Сергеевич	+7 (999) 999-99-99	executor	\N	\N	t	2026-01-26 12:57:48.143512	Сантехник	\N	3.50	2	2026-01-26 14:32:12.600475
e2ea50d1-187e-40eb-8e4a-693bd2e0bf27	vlad@test.ru	$2b$10$0KUYZQ00uMPdHBEx/CFfoOdArJWlbTdvjX3nVHzpx3f2pWnp4vZ8a	Владислав	Бешкарев	\N	\N	resident	12	119002, Москва, пер. Сивцев Вражек 31/13	t	2026-01-25 15:41:03.578147	\N	\N	0.00	0	2026-01-25 19:58:54.429125
de7750c6-daff-4406-ae54-b153d3844590	ivan.sivtsev@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Иван	Петров	\N	\N	resident	15	119002, Москва, пер. Сивцев Вражек 31/13	t	2026-01-30 16:56:22.783482	\N	\N	0.00	0	2026-01-30 16:56:22.783482
2e37a482-8f4c-4638-b81a-8092199e7232	maria.sivtsev@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Мария	Иванова	\N	\N	resident	22	119002, Москва, пер. Сивцев Вражек 31/13	t	2026-01-30 16:56:22.842321	\N	\N	0.00	0	2026-01-30 16:56:22.842321
eddd57b1-8be9-41d7-b09f-691046e76438	alex.vlasev@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Алексей	Смирнов	\N	\N	resident	8	119034, Москва, Большой Власьевский пер., 15	t	2026-01-30 16:56:22.900714	\N	\N	0.00	0	2026-01-30 16:56:22.900714
2c3e5755-82d3-448c-96f3-f6065a363bc0	olga.vlasev@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Ольга	Кузнецова	\N	\N	resident	12	119034, Москва, Большой Власьевский пер., 15	t	2026-01-30 16:56:22.955157	\N	\N	0.00	0	2026-01-30 16:56:22.955157
bdfbff9f-78cd-4d2a-b5f4-927787cef258	dmitry.plush@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Дмитрий	Волков	\N	\N	resident	45	119121, Москва, ул. Плющиха, 42	t	2026-01-30 16:56:23.012461	\N	\N	0.00	0	2026-01-30 16:56:23.012461
a93313e2-4b4c-43d0-b216-06b97d86c302	elena.plush@test.ru	$2b$10$U72.7So9nWYxP8AC/RaPr.JvtgYajaG9eI93wYcC7FMLhdW4UAkrK	Елена	Морозова	\N	\N	resident	67	119121, Москва, ул. Плющиха, 42	t	2026-01-30 16:56:23.075566	\N	\N	0.00	0	2026-01-30 16:56:23.075566
\.


--
-- Name: requests PK_0428f484e96f9e6a55955f29b5f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY (id);


--
-- Name: meters PK_0a71b52dbb545fa36efaf070583; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meters
    ADD CONSTRAINT "PK_0a71b52dbb545fa36efaf070583" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: news PK_39a43dfcb6007180f04aff2357e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY (id);


--
-- Name: user_news_read PK_48f451c74b558e01fa5f556105c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_news_read
    ADD CONSTRAINT "PK_48f451c74b558e01fa5f556105c" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: buildings PK_bc65c1acce268c383e41a69003a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT "PK_bc65c1acce268c383e41a69003a" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: news_buildings news_buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_buildings
    ADD CONSTRAINT news_buildings_pkey PRIMARY KEY (id);


--
-- Name: payments FK_d35cb3c13a18e1ea1705b2817b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 7Zh3026fae6x23J5a5OhMajtSHJ4Iur5kigGhCgbgRUloTMH9MwEyRPtpNRArwK

