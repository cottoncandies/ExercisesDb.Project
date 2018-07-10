package exercisesdb.common;

import java.util.Calendar;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Created with IntelliJ IDEA.
 * User: Andy Yin
 * Date: 13-8-25
 * Time: 上午12:04
 */
public class LongId {

        private static final long TIME_MAX_VALUE = 34359738367L; //时间最大值
        private static final int RANDOM_MAX_VALUE = 16383;//顺序最大值   //14Bit
        private static final int INSTANCE_ID_MAX_VALUE = 16383; //实例最大值 14BIT

        private static long _baseTime = 0;
        private static int _appInstanceId;
        private static AtomicInteger _totalCounter;
        private static AtomicLong _lastTime = new AtomicLong(0);
        private static Object _syncObject = new Object();

        private long _currentTime;
        private int _currentCounter;
        //实例码，每个机器不同
        private int _instanceId = 0;

        static {
                Calendar c = Calendar.getInstance();
                c.set(2018, Calendar.JANUARY, 1, 0, 0, 0);
                _baseTime = c.getTime().getTime() / 1000;

                _appInstanceId = Math.abs((new Random()).nextInt());
                _appInstanceId = _appInstanceId % INSTANCE_ID_MAX_VALUE;
                _totalCounter = new AtomicInteger(0);
        }

        /**
         * Gets the machine identifier.
         *
         * @return the machine identifier
         */
        public static long getAppInstanceId() {
                return _appInstanceId;
        }

        public static void setAppInstanceId(int defaultInstanceId) {
                LongId._appInstanceId = defaultInstanceId;
        }

        private long getCurrentTimeValue() {
                return System.currentTimeMillis() / 1000 - _baseTime;
        }

        private void generateNewCounter() {
                _currentTime = getCurrentTimeValue();
                int v = _totalCounter.incrementAndGet();
                if (v >= RANDOM_MAX_VALUE)
                {
                        synchronized (_syncObject)
                        {
                                v = _totalCounter.incrementAndGet();
                                if (v >= RANDOM_MAX_VALUE)
                                {
                                        v = v % RANDOM_MAX_VALUE;
                                        _totalCounter.set(v);
                                        long pt = _lastTime.get();
                                        _currentTime = getCurrentTimeValue();
                                        while (pt == _currentTime)
                                        {
                                                try {
                                                        Thread.sleep(5); //5ms
                                                } catch (InterruptedException e) {
                                                        e.printStackTrace();
                                                        //Do Nothing
                                                }
                                                _currentTime = getCurrentTimeValue();
                                        }
                                }
                        }
                }

                _currentCounter = v;
                _lastTime.set(getCurrentTimeValue());
        }

        /**
         * Create a new object id.
         */
        public LongId() {
                _instanceId = _appInstanceId;
                generateNewCounter();
        }



        public long toLong() {
                long result = _currentTime;
                if (result > TIME_MAX_VALUE)
                {
                        throw new IllegalArgumentException("Time overflow!");
                }

                result = result << 28; //从第31位移动到第62位，第63位为符号位 63-33+1=31
                long newCounter = _currentCounter;
                newCounter = newCounter << 14; //从第13位移动到第30位，第31位为时间的最后一位  30-16+1=17
                result = result | newCounter | _instanceId;
                return result;
        }

       public static long getId(){
                return (new LongId()).toLong();
       }
}
