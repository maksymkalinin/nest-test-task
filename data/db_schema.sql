--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1 (Debian 12.1-1.pgdg100+1)
-- Dumped by pg_dump version 12.1 (Debian 12.1-1.pgdg100+1)

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
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: car; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.car (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    price integer NOT NULL,
    "firstRegistrationDate" timestamp without time zone NOT NULL,
    discount smallint,
    "manufacturerId" uuid
);


--
-- Name: manufacturer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manufacturer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    siret integer NOT NULL
);


--
-- Name: owner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.owner (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    "purchaseDate" timestamp without time zone NOT NULL,
    "carId" uuid
);


--
-- Data for Name: car; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.car (id, price, "firstRegistrationDate", discount, "manufacturerId") FROM stdin;
\.


--
-- Data for Name: manufacturer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.manufacturer (id, name, phone, siret) FROM stdin;
\.


--
-- Data for Name: owner; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.owner (id, name, "purchaseDate", "carId") FROM stdin;
\.


--
-- Name: car PK_55bbdeb14e0b1d7ab417d11ee6d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY (id);


--
-- Name: manufacturer PK_81fc5abca8ed2f6edc79b375eeb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manufacturer
    ADD CONSTRAINT "PK_81fc5abca8ed2f6edc79b375eeb" PRIMARY KEY (id);


--
-- Name: owner PK_8e86b6b9f94aece7d12d465dc0c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY (id);


--
-- Name: car FK_219df163feb468a934c3a7b24ca; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT "FK_219df163feb468a934c3a7b24ca" FOREIGN KEY ("manufacturerId") REFERENCES public.manufacturer(id) ON DELETE CASCADE;


--
-- Name: owner FK_732957c1d4ade78a38331490d76; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "FK_732957c1d4ade78a38331490d76" FOREIGN KEY ("carId") REFERENCES public.car(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
