package exercisesdb.utils;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 简单并行计算。
 * <pre>
 * SimpleParallel.run(new IParallelRun() {
 *      @Override
 *      public void run(Object... arg) {
 *          System.out.println("Parallel Run");
 *      }
 *  });
 * </pre>
 */
public class SimpleParallel {
    private static ExecutorService cachedThreadPool = Executors.newCachedThreadPool();

    /**
     * 执行并行运算
     *
     * @param r    并行运算对象
     * @param args 传递给对象的参数
     */
    public static void run(IParallelRun r, Object... args) {
        if (null != r) {
            cachedThreadPool.execute(new Runnable() {
                @Override
                public void run() {
                    r.run(args);
                }
            });
        }
    }
}
