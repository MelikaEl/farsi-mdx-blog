import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-center">
        <span>درباره ما</span>
      </h1>
      <p className="flex flex-col gap-6">
        ما هم مثل شما عاشق سفرهستیم و زیاد سفر می کنیم و اعتقاد داریم وقتی سفر
        می کنیم بیشتر به عظمت جهان هستی پی می بریم و بهتر می توانیم حقایق این
        دنیا را کشف کنیم. اما مشکلی که همیشه در سفرها داشته ایم این بود که نمی
        توانستیم قبل از سفر یک برنامه سفر مناسب را تهیه کنیم تا با برنامه ریزی
        دقیق بتوانیم از وقتمان بهترین استفاده ممکن را داشته باشیم. برای همین
        تصمیم گرفتیم این مشکل را برای همیشه حل کنیم و آتریپا را به وجود آوردیم.
        آتریپا بعنوان سامانه هوشمند سفر بر اساس سلیقه و علایق و خصوصیات شما در
        انتخاب مقصد، تاریخ سفر، خرید بلیط، رزرو اقامتگاه، طراحی برنامه سفر و ...
        شما را یاری می کند. تلاش ما در آتریپا طراحی سفری با کیفیت و اختصاصی برای
        شماست که بهترین قیمت و جذاب ترین برنامه را ارایه نماید. لذا متخصصین هوش
        مصنوعی و فناوری اطلاعات را گردهم آورده ایم تا با کمک آخرین الگوریتم ها و
        تکنولوژی های روز دنیا، آتریپا بعنوان دستیاری هوشمند، سفری سرشار از لذت و
        خاطره انگیز را برای شما فراهم آورد.
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold text-center">
        <span>تیم ما</span>
      </h1>
      <span></span>
      <div className="flex items-center justify-center">
        <Image
          className="rounded-lg"
          src="/alishahi.jpg"
          alt="Picture of the author"
          width={300}
          height={300}
        />
      </div>
      <h2 className="text-4xl sm:text-5xl font-light text-center">
        <span>محمد علیشاهی</span>
      </h2>
      <h3 className="text-4xl sm:text-5xl font-thin text-center">
        <span>مدیر عامل</span>
      </h3>
      <p className="flex flex-col gap-6 text-center">
        فارغ التحصیل دکتری کامپیوتر، عضو هیات علمی دانشگاه، متخصص حوزه شبکه های
        کامپیوتری، شهر هوشمند، داده کاوی
      </p>
      <div className="flex items-center justify-center">
        <Image
          className="rounded-lg"
          src="/ravakhah.jpg"
          alt="Picture of the author"
          width={300}
          height={300}
        />
      </div>
      <h2 className="text-4xl sm:text-5xl font-light text-center">
        <span>مهدی رواخواه</span>
      </h2>
      <h3 className="text-4xl sm:text-5xl font-thin text-center">
        <span>مدیر هوشمندسازی و تحلیل داده</span>
      </h3>
      <p className="flex flex-col gap-6 text-center">
        فارغ التحصیل دکتری کامپیوتر، عضو هیات علمی دانشگاه، متخصص حوزه داده
        کاوی، هوش مصنوعی و یادگیری ماشین، پایگاه داده و داده های حجیم
      </p>
      <div className="flex items-center justify-center ">
        <Image
          className="rounded-lg"
          src="/saeed-alishahi.jpg"
          alt="Picture of the author"
          width={300}
          height={300}
        />
      </div>
      <h2 className="text-4xl sm:text-5xl font-light text-center">
        <span>سعید علیشاهی</span>
      </h2>
      <h3 className="text-4xl sm:text-5xl font-thin text-center">
        <span>مدیر امور بازرگانی</span>
      </h3>
      <p className="flex flex-col gap-6 text-center">
        فارغ التحصیل رشته مهندسی برق، مشاور امور تحقیقات، عضو هیئت مدیره، متخصص
        حوزه شبکه های هوشمند انرژی، طراح و ناظر ارشد سازمان نظام مهندسی
      </p>
    </div>
  );
}

