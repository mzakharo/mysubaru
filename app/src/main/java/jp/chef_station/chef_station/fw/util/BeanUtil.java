package jp.chef_station.chef_station.fw.util;

import java.lang.reflect.AccessibleObject;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.LinkedList;

/* loaded from: classes.dex */
public class BeanUtil {

    /* loaded from: classes.dex */
    public interface FieldReflectCallback {
        void fieldReflectCallback(String str, Object obj);
    }

    public static final void setField(Object obj, String str, Object obj2) {
        Class<?> cls = obj.getClass();
        try {
            try {
                LogUtil.v("_log", "elementName=" + str + "\ninstance=" + obj2);
                Field declaredField = cls.getDeclaredField(str);
                AccessibleObject.setAccessible(new Field[]{declaredField}, true);
                setFieldValue(obj, declaredField, obj2);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (IllegalArgumentException e2) {
                e2.printStackTrace();
            } catch (NoSuchFieldException unused) {
                Field superClassField = getSuperClassField(cls, str);
                if (superClassField != null) {
                    LogUtil.v("_log", "elementName=" + str + "\ninstance=" + obj2);
                    setFieldValue(obj, superClassField, obj2);
                }
            } catch (SecurityException e3) {
                e3.printStackTrace();
            } catch (Exception e4) {
                e4.printStackTrace();
                LogUtil.d("_log", "FAILED : " + str + ", " + obj2);
            }
        } catch (Throwable th) {
            th.printStackTrace();
        }
    }

    public static void setFieldValue(Object obj, Field field, Object obj2) throws Exception {
        try {
            if (field.getType().equals(Integer.TYPE)) {
                field.setInt(obj, Integer.parseInt((String) obj2));
            } else if (field.getType().equals(Long.TYPE)) {
                field.setLong(obj, Long.parseLong((String) obj2));
            } else if (field.getType().equals(Short.TYPE)) {
                field.setShort(obj, Short.parseShort((String) obj2));
            } else if (field.getType().equals(Boolean.TYPE)) {
                field.setBoolean(obj, Boolean.parseBoolean((String) obj2));
            } else {
                field.set(obj, obj2);
            }
        } catch (ClassCastException unused) {
            field.set(obj, obj2);
        }
    }

    public static Field getSuperClassField(Class<?> cls, String str) {
        Class<? super Object> superclass = (Class<? super Object>) cls.getSuperclass();
        if (superclass == null) {
            return null;
        }
        try {
            Field declaredField = superclass.getDeclaredField(str);
            AccessibleObject.setAccessible(new Field[]{declaredField}, true);
            return declaredField;
        } catch (NoSuchFieldException unused) {
            return getSuperClassField(superclass, str);
        }
    }

    public static final boolean accept(Field field) {
        return (Modifier.isTransient(field.getModifiers()) || Modifier.isStatic(field.getModifiers())) ? false : true;
    }

    public static void fieldRefrect(Object obj, FieldReflectCallback fieldReflectCallback) {
        if (obj == null) {
            return;
        }
        Field[] fields = getFields(obj.getClass(), Object.class);
        AccessibleObject.setAccessible(fields, true);
        for (Field field : fields) {
            if (accept(field)) {
                String name = field.getName();
                try {
                    Object obj2 = field.get(obj);
                    if (obj2 != null) {
                        fieldReflectCallback.fieldReflectCallback(name, obj2);
                    }
                } catch (IllegalAccessException e) {
                    throw new InternalError("Unexpected IllegalAccessException: " + e.getMessage());
                }
            }
        }
    }

    private static <E> Field[] getFields(Class<? extends E> cls, Class<E> cls2) {
        LinkedList linkedList = new LinkedList();
        getFields(cls, cls2, linkedList);
        return (Field[]) linkedList.toArray(new Field[0]);
    }

    private static <E> void getFields(Class<? extends E> cls, Class<E> cls2, LinkedList<Field> linkedList) {
        if (cls.equals(cls2)) {
            return;
        }
        linkedList.addAll(Arrays.asList(cls.getDeclaredFields()));
        getFields((Class<? extends E>) cls.getSuperclass(), cls2, linkedList);
    }
}
