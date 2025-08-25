require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false;

const connectMongoose = async () => {
  try {
    if (isConnected) {
      console.log('🔄 이미 데이터베이스에 연결되어 있습니다.');
      return mongoose.connection;
    }

    // .env 파일에서 데이터베이스 연결 정보 가져오기
    const mongoUri = process.env.MONGODB_URI;
 

    // 연결 문자열 생성
    let connectionString = mongoUri;
  

    console.log('🔌 데이터베이스 연결 시도...');
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('✅ MongoDB 연결 성공');
    
    // 연결 이벤트 리스너 설정
    mongoose.connection.on('error', (error: any) => {
      console.error('❌ MongoDB 연결 오류:', error);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB 연결이 끊어졌습니다.');
      isConnected = false;
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    isConnected = false;
    throw error;
  }
};

const disconnectMongoose = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('✅ MongoDB 연결 해제');
    } else {
      console.log('ℹ️ 이미 연결이 해제되어 있습니다.');
    }
  } catch (error) {
    console.error('❌ MongoDB 연결 해제 실패:', error);
    throw error;
  }
};

const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

module.exports = { 
  connectMongoose, 
  disconnectMongoose, 
  getConnectionStatus 
};
