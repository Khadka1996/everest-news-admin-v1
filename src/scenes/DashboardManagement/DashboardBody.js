
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

// Global components
import Topbar from "../global/topbar";
import Sidebar from "../global/sidebar";

// Main components
import Dashboard from "../dashboard";
import Tags from "../TagsAndCategory/Tags";
import Photo from "../PhotoAndVideo/Photo";
import PhotoList from "../PhotoAndVideo/PhotoList";
import Category from "../TagsAndCategory/Category";
import ArticleEnglish from '../EnglishArticle/englishArticle';
import EnglishArticleList from '../EnglishArticle/englishArticleList';
import VideoLinks from '../PhotoAndVideo/Video';
import VideoList from '../PhotoAndVideo/UpdateVideo';
import Author from '../Author/Author';
import AuthorList from '../Author/AuthorList';
import Advertisement from '../Advertisment/Advertisment';
import AdvertisementList from '../Advertisment/AdvertismentList';
import TimezoneData from './Sports/Football';
import Cricket from './Sports/Cricket';
import MonthCalendar from './Calender';
import Analytics from './Analytics';
import ChartPie from './ChartPie';
import LineChart from './LineChart';
import Geo from './Geo';
import Article from '../NepaliArticles/Articles';
import ArticleList from '../NepaliArticles/ArticleList';
import AdminList from './AdminList';
import UserList from './UserList';

const DashboardBody = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="dashboard-container" style={{ display: 'flex' }}>
          <Sidebar />
          <main className="content" style={{ flex: 1 }}>
            <Topbar />
            <div className="routes-container" style={{ padding: '16px' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/add/photo" element={<Photo />} />
                <Route path="/update/photo" element={<PhotoList />} />
                <Route path="/category" element={<Category />} />
                <Route path="/add/nepali" element={<Article/>} />
                <Route path="/update/nepali" element={<ArticleList/>} />
                <Route path="/add/english" element={<ArticleEnglish/>} />
                <Route path="/update/english" element={<EnglishArticleList/>} />
                <Route path="/add/video" element={<VideoLinks/>} />
                <Route path="/update/video" element={<VideoList/>} />
                <Route path="/add/author" element={<Author/>} />
                <Route path="/update/author" element={<AuthorList/>} />
                <Route path="/add/ads" element={<Advertisement/>} />
                <Route path="/update/ads" element={<AdvertisementList/>} />
                <Route path="/add/Football" element={<TimezoneData/>} />
                <Route path="/add/cricket" element={<Cricket/>} />
                <Route path="/calendar" element={<MonthCalendar/>} />
                <Route path="/bar" element={<Analytics/>} />
                <Route path="/pie" element={<ChartPie/>} />
                <Route path="/line" element={<LineChart/>} />
                <Route path="/geography" element={<Geo/>} />
                <Route path='/admin' element={<AdminList/>} />
                <Route path='/superadmin' element={<UserList/>} />


                {/* Add more routes here */}
              </Routes>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default DashboardBody;

