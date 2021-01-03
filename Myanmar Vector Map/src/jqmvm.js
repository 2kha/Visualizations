
/**
 * @summary     Myanmar Vector Map
 * @description Visualization for Myanmar Vector Map with States and Townships
 * @version     1.0.3
 * @file        jqmvm
 * @author      2KHA 
 * @contact     tl.aung@2kha.com
 * @copyright   Copyright (C) 2018-2021 Bambou Tree Myanmar Ltd.
 *
 * This source file is free software, available under the following license:
 *    GNU GENERAL PUBLIC LICENSE license - https://github.com/2kha/Visualizations/blob/main/LICENSE
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: https://github.com/2kha/Visualizations/tree/main/Myanmar%20Vector%20Map
 */



;(function ($) {

    $.fn.jqMyanmarVectorMap = function (options) {

        var map = this;
        var svg = null;
        var cover = null;
        var label = null;

        var mapRegions = null;

        var regionColor = [];
        var data = [];

        var selectedColor = "#F3E2A9";
        var hoveredColor = "#E0F2F7";

        var currentScale = 1;
        var currentLevel = 0;

        var backButton = null;

        var isDragging = false;

        var origin = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };

        var maps = [
            "Myanmar.svg",
            "Ayeyarwady.svg",
            "Bago.svg",
            "Chin.svg",
            "Kachin.svg",
            "Kayah.svg",
            "Kayin.svg",
            "Magway.svg",
            "Mandalay.svg",
            "Mon.svg",
            "Rakhine.svg",
            "Shan.svg",
            "Sagaing.svg",
            "Tanintharyi.svg",
            "Yangon.svg",
            "Naypyidaw.svg"
        ];

        var enNames = [
            [
                "Ayeyarwady Region",
                "Bago Region",
                "Chin State",
                "Kachin State",
                "Kayah State",
                "Kayin State",
                "Magway Region",
                "Mandalay Region",
                "Mon State",
                "Rakhine State",
                "Shan State",
                "Sagaing Region",
                "Tanintharyi Region",
                "Yangon Region",
                "Naypyidaw Region"
            ],
            [
                "Hinthada Township",
                "Zalun Township",
                "Laymyethna Township",
                "Myanaung Township",
                "Kyangin Township",
                "Ingapu Township",
                "Labutta Township",
                "Mawlamyinegyun Township",
                "Ma-ubin Township",
                "Pantanaw Township",
                "Nyaungdon Township",
                "Danuphyu Township",
                "Myaungmya Township",
                "Einme Township",
                "Wakema Township",
                "Pathein Township",
                "Kangyidaunk Township",
                "Thabaung Township",
                "Ngapudaw Township",
                "Kyonpyaw Township",
                "Yekyi Township",
                "Kyaunggon Township",
                "Pyapon Township",
                "Bogale Township",
                "Kyaiklat Township",
                "Dedaye Township"
            ],
            [
                "Bago Township",
                "Kawa Township",
                "Thanatpin Township",
                "Waw Township",
                "Daik-U Township",
                "Nyaunglebin Township",
                "Shwegyin Township",
                "Taungoo Township",
                "Oktwin Township",
                "Tantabin Township",
                "Yedashe Township",
                "Pyu Township",
                "Kyauktaga Township",
                "Kyaukkyi Township",
                "Pyay Township",
                "Pauk Kaung Township",
                "Thegon Township",
                "Shwedaung Township",
                "Padaung Township",
                "Paungde Township",
                "Nattalin Township",
                "Zigon Township",
                "Thayarwady Township",
                "Gyobingauk Township",
                "Letpadan Township",
                "Minhla Township",
                "Monyo Township",
                "Okpho Township"

            ],
            [
                "Falam Township",
                "Haka Township",
                "Htantlang Township",
                "Tiddim Township",
                "Ton Zang Township",
                "Mindat Township",
                "Matupi Township",
                "Kanpetlet Township",
                "Paletwa Township"
            ],
            [
                "Bhamo Township",
                "Shwegu Township",
                "Momauk Township",
                "Mansi Township",
                "Mohnyin Township",
                "Mogaung Township",
                "Hpakant Township",
                "Myitkyina Township",
                "Waingmaw Township",
                "Injangyang Township",
                "Tanai Township",
                "Chipwi Township",
                "Hsawlaw Township",
                "Putao Township",
                "Sumprabum Township",
                "Machanbaw Township",
                "Kawnglanghpu Township",
                "Nogmung Township"
            ],
            [
                "Bawlakhe Township",
                "Hpasawng Township",
                "Mese Township",
                "Loikaw Township",
                "Demoso Township",
                "Hpruso Township",
                "Shadaw Township",
            ],
            [
                "Hpa-an Township",
                "Hlaignbwe Township",
                "Hpapun Township",
                "Thandang Township",
                "Kawkareik Township",
                "Kyain Seikgyi Township",
                "Myawaddy Township"
            ],
            [
                "Gangaw Township",
                "Tilin Township ",
                "Saw Township",
                "Magway Township",
                "Yenangyaung Township",
                "Chauck Township",
                "Taungdwingyi Township",
                "Myothit Township",
                "Natmauk Township",
                "Minbu Township",
                "Pwintbyu Township",
                "Ngape Township",
                "Salin Township",
                "Sidoktaya Township",
                "Myaing Township",
                "Pakokku Township",
                "Pauk Township",
                "Seikphyu Township",
                "Yesagyo Township",
                "Aunglan Township",
                "Kamma Township",
                "Mindon Township",
                "Minhla Township",
                "Sinbaungwe Township",
                "Thayet Township"
            ],
            [
                "Kyaukse Township",
                "Myittha Township",
                "Sintgaing Township",
                "Tada - U Township",
                "Amarapura Township",
                "Aungmyethazan Township",
                "Chanayethazan Township",
                "Chanmyathazi Township",
                "Mahaaungmye Township",
                "Patheingyi Township",
                "Pyigyidagun Township",
                "Mahlaing Township",
                "Meiktila Township",
                "Thazi Township",
                "Wundwin Township",
                "Kyaukpadaung Township",
                "Myingyan Township",
                "Natogyi Township",
                "Nganzun Township",
                "Thaungtha Township",
                "Nyaung - U Township",
                "Madaya Township",
                "Mogok Township",
                "Pyinoolwin Township",
                "Singu Township",
                "Thabeikkyin Township",
                "Pyawbwe Township",
                "Yamethin Township"
            ],
            [
                "Mawlamyine Township",
                "Kyaikmaraw Township",
                "Chaungzon Township",
                "Thanbyuzayat Township",
                "Mudon Township",
                "Ye Township",
                "Thaton Township",
                "Paung Township",
                "Kyaikto Township",
                "Bilin Township"

            ],
            [
                "Kyaukpyu Township",
                "Manaung Township",
                "Ramree Township",
                "Ann Township",
                "Maungdaw Township",
                "Buthidaung Township",
                "Sittwe Township",
                "Ponnagyun Township",
                "Mrauk-U Township",
                "Kyauktaw Township",
                "Minbya Township",
                "Myebon Township",
                "Pauktaw Township",
                "Rathedaung Township",
                "Thandwe Township",
                "Toungup Township",
                "Gwa Township"
            ],
            [
                "Kengtung Township",
                "Mong Khet Township",
                "Mong Yang Township",
                "Mong Hsat Township",
                "Mong Ping Township",
                "Mong Tong Township",
                "Mong Hpayak Township",
                "Mong Yawng Township",
                "Tachileik Township",
                "Mong La Township",
                "Kunlong Township",
                "Hopang Township",
                "Kyaukme Township",
                "Nawnghkio Township",
                "Hsipaw Township",
                "Namtu Township",
                "Namhsan Township",
                "Mongmit Township",
                "Mabein Township",
                "Mantong Township",
                "Laukkaing Township",
                "Lashio Township",
                "Hseni Township",
                "Mongyai Township",
                "Tangyan Township",
                "Mu Se Township",
                "Namhkam Township",
                "Kutkai Township",
                "Langkho Township",
                "Mong Nai Township",
                "Mawkmai Township",
                "Mong Pan Township",
                "Loilen Township",
                "Lai - Hka Township",
                "Nansang Township",
                "Kunhing Township",
                "Kyethi Township",
                "Mong Kung Township",
                "Mong Hsu Township",
                "Taunggyi Township",
                "Nyaungshwe Township",
                "Hopong Township",
                "Hsi Hseng Township",
                "Kalaw Township",
                "Pingdaya Township",
                "Ywangan Township",
                "Lawksawk Township",
                "Pinlaung Township",
                "Pekon Township",
                "Konkyan Township (Self - Administered Region)",
                "Mongmao Township (Self - Administered Region)",
                "Pangsang Township (Self - Administered Region)",
                "Narphan Township (Self - Administered Region)",
                "Pangwaun Township (Self - Administered Township)",
                "Matman Township (Self - Administered Region)"
            ],
            [
                "Hkamti Township",
                "Homalin Township",
                "Lahe Township",
                "Lashe Township",
                "Nanyun Township",
                "Kale Township",
                "Kalewa Township",
                "Mingin Township",
                "Banmauk Township",
                "Indaw Township",
                "Katha Township",
                "Kawlin Township",
                "Pinlebu Township",
                "Tigyaing Township",
                "Wuntho Township",
                "Mawlaik Township",
                "Paungbyin Township",
                "Ayadaw Township",
                "Budalin Township",
                "Chaung-U Township",
                "Kani Township",
                "Monywa Township",
                "Pale Township",
                "Salingyi Township",
                "Tabayin Township",
                "Yinmabin Township",
                "Myaung Township",
                "Myinmu Township",
                "Sagaing Township",
                "Kanbalu Township",
                "Khin-U Township",
                "Kyunhla Township",
                "Shwebo Township",
                "Taze Township",
                "Wetlet Township",
                "Ye-U Township",
                "Tamu Township",
            ],
            [
                "Dawei Township",
                "Launglon Township",
                "Thayetchaung Township",
                "Yebyu Township",
                "Bokpyin Township",
                "Kawthoung Township",
                "Kyunsu Township",
                "Myeik Township",
                "Palaw Township",
                "Tanintharyi Township"
            ],
            [
                "Botataung Township",
                "Dagon Seikkan Township",
                "East Dagon Township",
                "North Dagon Township",
                "North Okkalapa Township",
                "Pazundaung Township",
                "South Dagon Township",
                "South Okkalapa Township",
                "Thingangyun Township",
                "Hlaing Township",
                "Hlaingthaya Township",
                "Insein Township",
                "Kamayut Township",
                "Mayangon Township",
                "Mingaladon Township",
                "Shwepyitha Township",
                "Yankin Township",
                "Dala Township",
                "Dawbon Township",
                "Mingala Taungnyunt Township",
                "Seikkyi Kanaungto Township",
                "Tamwe Township",
                "Thaketa Township",
                "Ahlon Township",
                "Bahan Township",
                "Dagon Township",
                "Kyauktada Township",
                "Kyimyindaing Township",
                "Lanmadaw Township",
                "Latha Township",
                "Pabedan Township",
                "Sanchaung Township",
                "Seikkan Township",
                "Cocokyun Township",
                "Hlegu Township",
                "Hmawbi Township",
                "Htantabin Township",
                "Kawhmu Township",
                "Kayan Township",
                "Kungyangon Township",
                "Kyauktan Township",
                "Taikkyi Township",
                "Thanlyin Township",
                "Thongwa Township",
                "Twante Township"
            ],
            [
                "Lewe Township",
                "Pyinmana Township",
                "Tatkon Township",
                "Ottarathiri Township",
                "Dekkhinathiri Township",
                "Pobbathiri Township",
                "Zabuthiri Township",
                "Zeyathiri Township"
            ]
        ];

        var mmNames = [
            [
                "ဧရာဝတီတိုင်းဒေသကြီး",
                "ပဲခူးတိုင်းဒေသကြီး",
                "ချင်းပြည်နယ်",
                "ကချင်ပြည်နယ်",
                "ကယားပြည်နယ်",
                "ကရင်ပြည်နယ်",
                "မကွေးတိုင်းဒေသကြီး",
                "မန္တလေးတိုင်းဒေသကြီး",
                "မွန်ပြည်နယ်",
                "ရခိုင်ပြည်နယ်",
                "ရှမ်းပြည်နယ်",
                "စစ်ကိုင်းတိုင်းဒေသကြီး",
                "တနင်္သာရီတိုင်းဒေသကြီး",
                "ရန်ကုန်တိုင်းဒေသကြီး",
                "နေပြည်တော်"
            ],
            [
                "ဟင်္သာတမြို့နယ်",
                "ဇလွန်မြို့နယ်",
                "လေးမျက်နှာမြို့နယ်",
                "မြန်အောင်မြို့နယ်",
                "ကြံခင်းမြို့နယ်",
                "အင်္ဂပူမြို့နယ်",
                "လပွတ္တာမြို့နယ်",
                "မော်လမြိုင်ကျွန်းမြို့နယ်",
                "မအူပင်မြို့နယ်",
                "ပန်းတနော်မြို့နယ်",
                "ညောင်တုန်းမြို့နယ်",
                "ဓနုဖြူမြို့နယ်",
                "မြောင်းမြမြို့နယ်",
                "အိမ်မဲမြို့နယ်",
                "ဝါးခယ်မမြို့နယ်",
                "ပုသိမ်မြို့နယ်",
                "ကန်ကြီးထောင့်မြို့နယ်",
                "သာပေါင်းမြို့နယ်",
                "ငပုတောမြို့နယ်",
                "ကျုံပျော်မြို့နယ်",
                "ရေကြည်မြို့နယ်",
                "ကျောင်းကုန်းမြို့နယ်",
                "ဖျာပုံမြို့နယ်",
                "ဘိုကလေးမြို့နယ်",
                "ကျိုက်လတ်မြို့နယ်",
                "ဒေးဒရဲမြို့နယ်"

            ],
            [
                "ပဲခူးမြို့နယ်",
                "ကဝမြို့နယ်",
                "သနပ်ပင်မြို့နယ်",
                "ဝေါမြို့နယ်",
                "ဒိုက်ဦးမြို့နယ်",
                "ညောင်လေးပင်မြို့နယ်",
                "ရွှေကျင်မြို့နယ်",
                "တောင်ငူမြို့နယ်",
                "အုတ်တွင်းမြို့နယ်",
                "ထန်းတပင်မြို့နယ်",
                "ရေတာရှည်မြို့နယ်",
                "ဖြူးမြို့နယ်",
                "ကျောက်တံခါးမြို့နယ်",
                "ကျောက်ကြီးမြို့နယ်",
                "ပြည်မြို့နယ်",
                "ပေါက်ခေါင်းမြို့နယ်",
                "သဲကုန်းမြို့နယ်",
                "ရွှေတောင်မြို့နယ်",
                "ပန်းတောင်းမြို့နယ်",
                "ပေါင်းတည်မြို့နယ်",
                "နတ်တလင်းမြို့နယ်",
                "ဇီးကုန်းမြို့နယ်",
                "သာယာဝတီမြို့နယ်",
                "ကြို့ပင်ကောက်မြို့နယ်",
                "လက်ပံတန်းမြို့နယ်",
                "မင်းလှမြို့နယ်",
                "မိုးညိုမြို့နယ်",
                "အုတ်ဖိုမြို့နယ်"
            ],
            [
                "ဖလမ်းမြို့နယ်",
                "ဟားခါးမြို့နယ်",
                "ထန်တလန်မြို့နယ်",
                "တီးတိန်မြို့နယ်",
                "တွန်းဇံမြို့နယ်",
                "မင်းတပ်မြို့နယ်",
                "မတူပီမြို့နယ် ",
                "ကန်ပက်လက်မြို့နယ်",
                "ပလက်ဝမြို့နယ်"
            ],
            [
                "ဗန်းမော်မြို့နယ်",
                "ရွှေကူမြို့နယ်",
                "မိုးမောက်မြို့နယ်",
                "မံစီမြို့နယ်",
                "မိုးညှင်းမြို့နယ်",
                "မိုးကောင်းမြို့နယ်",
                "ဖားကန့်မြို့နယ်",
                "မြစ်ကြီးနားမြို့နယ်",
                "ဝိုင်းမော်မြို့နယ်",
                "အင်ဂျန်းယန်မြို့နယ်",
                "တနိုင်းမြို့နယ်",
                "ချီဖွေမြို့နယ်",
                "ဆော့လော်မြို့နယ်",
                "ပူတာအိုမြို့နယ်",
                "ဆွမ်ပရာဘွမ်မြို့နယ်",
                "မချမ်းဘောမြို့နယ်",
                "ခေါင်လန်ဖူးမြို့နယ်",
                "နောင်မွန်းမြို့နယ်"
            ],
            [
                "ဘော်လခဲမြို့နယ်",
                "ဖားဆောင်းမြို့နယ်",
                "မယ်စဲ့မြို့နယ်",
                "လွိုင်ကော်မြို့နယ်",
                "ဒီမောဆိုးမြို့နယ်",
                "ဖရူးဆိုးမြို့နယ်",
                "ရှားတောမြို့နယ်"
            ],
            [

                "ဘားအံမြို့နယ်",
                "လှိုင်းဘွဲ့မြို့နယ်",
                "ဖာပွန်မြို့နယ်",
                "သံတောင်ကြီးမြို့နယ်",
                "ကော့ကရိတ်မြို့နယ်",
                "ကြာအင်းဆိပ်ကြီးမြို့နယ်",
                "မြဝတီမြို့နယ်"

            ],
            [
                "ဂန့်ဂေါမြို့နယ်",
                "ထီးလင်းမြို့နယ်",
                "ဆောမြို့နယ်",
                "မကွေးမြို့နယ်",
                "ရေနံချောင်းမြို့နယ်",
                "ချောက်မြို့နယ်",
                "တောင်တွင်းကြီးမြို့နယ်",
                "မြို့သစ်မြို့နယ်",
                "နတ်မောက်မြို့နယ်",
                "မင်းဘူးမြို့နယ်",
                "ပွင့်ဖြူမြို့နယ်",
                "ငဖဲမြို့နယ်",
                "စလင်းမြို့နယ်",
                "စေတုတ္တရာမြို့နယ်",
                "မြိုင်မြို့နယ်",
                "ပခုက္ကူမြို့နယ်",
                "ပေါက်မြို့နယ်",
                "ဆိပ်ဖြူမြို့နယ်",
                "ရေစကြိုမြို့နယ်",
                "အောင်လံမြို့နယ်",
                "ကံမမြို့နယ်",
                "မင်းတုန်းမြို့နယ်",
                "မင်းလှမြို့နယ်",
                "ဆင်ပေါင်ဝဲမြို့နယ်",
                "သရက်မြို့နယ်"
            ],
            [
                "ကျောက်ဆည်မြို့နယ်",
                "မြစ်သားမြို့နယ်",
                "စဉ့်ကိုင်မြို့နယ်",
                "တံတားဦးမြို့နယ်",
                "အမရပူရမြို့နယ်",
                "အောင်မြေသာဇံမြို့နယ်",
                "ချမ်းအေးသာဇံမြို့နယ်",
                "ချမ်းမြသာစည်မြို့နယ်",
                "မဟာအောင်မြေမြို့နယ်",
                "ပုသိမ်ကြီးမြို့နယ်",
                "ပြည်ကြီးတံခွန်မြို့နယ်",
                "မလှိုင်မြို့နယ်",
                "မိတ္ထီလာမြို့နယ်",
                "သာစည်မြို့နယ်",
                "ဝမ်းတွင်းမြို့နယ်",
                "ကျောက်ပန်းတောင်းမြို့နယ်",
                "မြင်းခြံမြို့နယ်",
                "နွားထိုးကြီးမြို့နယ်",
                "ငါန်းဇွန်မြို့နယ်",
                "တောင်သာမြို့နယ်",
                "ညောင်ဦးမြို့နယ်",
                "မတ္တရာမြို့နယ်",
                "မိုးကုတ်မြို့နယ်",
                "ပြင်ဦးလွင်မြို့နယ်",
                "စဉ့်ကူမြို့နယ်",
                "သပိတ်ကျင်းမြို့နယ်",
                "ပျော်ဘွယ်မြို့နယ်",
                "ရမည်းသင်းမြို့နယ်"
            ],
            [
                "မော်လမြိုင်မြို့နယ်",
                "ကျိုက်မရောမြို့နယ်",
                "ချောင်းဆုံမြို့နယ်",
                "သံဖြူဇရပ်မြို့နယ်",
                "မုဒုံမြို့နယ်",
                "ရေးမြို့နယ်",
                "သထုံမြို့နယ်",
                "ပေါင်မြို့နယ်",
                "ကျိုက်ထိုမြို့နယ်",
                "ဘီးလင်းမြို့နယ်"
            ],
            [
                "ကျောက်ဖြူမြို့နယ်",
                "မာန်အောင်မြို့နယ်",
                "ရမ်းဗြဲမြို့နယ်",
                "အမ်းမြို့နယ်",
                "မောင်တောမြို့နယ်",
                "ဘူးသီးတောင်မြို့နယ်",
                "စစ်တွေမြို့နယ်",
                "ပုဏ္ဏားကျွန်းမြို့နယ်",
                "မြောက်ဦးမြို့နယ်",
                "ကျောက်တော်မြို့နယ်",
                "မင်းပြားမြို့နယ်",
                "မြေပုံမြို့နယ်",
                "ပေါက်တောမြို့နယ်",
                "ရသေ့တောင်မြို့နယ်",
                "သံတွဲမြို့နယ်",
                "တောင်ကုတ်မြို့နယ်",
                "ဂွမြို့နယ်"
            ],
            [
                "ကျိုင်းတုံမြို့နယ်",
                "မိုင်းခတ်မြို့နယ်",
                "မိုင်းယန်းမြို့နယ်",
                "မိုင်းဆတ်မြို့နယ်",
                "မိုင်းပြင်းမြို့နယ်",
                "မိုင်းတုံမြို့နယ်",
                "မိုင်းဖြတ်မြို့နယ်",
                "မိုင်းယောင်းမြို့နယ်",
                "တာချီလိတ်မြို့နယ်",
                "မိုင်းလားမြို့နယ်",
                "ကွမ်းလုံမြို့နယ်",
                "ဟိုပန်မြို့နယ်",
                "ကျောက်မဲမြို့နယ်",
                "နောင်ချိုမြို့နယ်",
                "သီပေါမြို့နယ်",
                "နမ္မတူမြို့နယ်",
                "နမ့်ဆန်မြို့နယ်",
                "မိုးမိတ်မြို့နယ်",
                "မဘိမ်းမြို့နယ်",
                "မန်တုံမြို့နယ်",
                "လောက်ကိုင်မြို့နယ်",
                "လားရှိုးမြို့နယ်",
                "သိန္နီမြို့နယ်",
                "မိုင်းရယ်မြို့နယ်",
                "တန့်ယန်းမြို့နယ်",
                "မူဆယ်မြို့နယ်",
                "နမ့်ခမ်းမြို့နယ်",
                "ကွတ်ခိုင်မြို့နယ်",
                "လင်းခေးမြို့နယ်",
                "မိုးနဲမြို့နယ်",
                "မောက်မယ်မြို့နယ်",
                "မိုင်းပန်မြို့နယ်",
                "လွိုင်လင်မြို့နယ်",
                "လဲချားမြို့နယ်",
                "နမ့်စန်မြို့နယ်",
                "ကွန်ဟိန်းမြို့နယ်",
                "ကျေးသီးမြို့နယ်",
                "မိုင်းကိုင်မြို့နယ်",
                "မိုင်းရှူးမြို့နယ်",
                "တောင်ကြီးမြို့နယ်",
                "ညောင်ရွှေမြို့နယ်",
                "ဟိုပုံးမြို့နယ်",
                "ဆီဆိုင်မြို့နယ်",
                "ကလောမြို့နယ်",
                "ပင်းတယမြို့နယ်",
                "ရွာငံမြို့နယ်",
                "ရပ်စောက်မြို့နယ်",
                "ပင်လောင်းမြို့နယ်",
                "ဖယ်ခုံမြို့နယ်",
                "ကုန်ကျမ်းမြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)",
                "မိုင်းမော်မြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)",
                "ပန်ဆန်မြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)",
                "နာဖန်မြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)",
                "ပန်ဝန်မြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)",
                "မက်မန်မြို့နယ် (ကိုယ်ပိုင်အုပ်ချုပ်ခွင့်ရဒေသ)"
            ],
            [
                "ခန္တီးမြို့နယ်",
                "ဟုမ္မလင်းမြို့နယ်",
                "လဟယ်မြို့နယ်",
                "လေရှီးမြို့နယ်",
                "နန်းယွန်းမြို့နယ်",
                "ကလေးမြို့နယ်",
                "ကလေးဝမြို့နယ်",
                "မင်းကင်းမြို့နယ်",
                "ဗန်းမောက်မြို့နယ်",
                "အင်းတော်မြို့နယ်",
                "ကသာမြို့နယ်",
                "ကောလင်းမြို့နယ်",
                "ပင်လယ်ဘူးမြို့နယ်",
                "ထီးချိုင့်မြို့နယ်",
                "ဝန်းသိုမြို့နယ်",
                "မော်လိုက်မြို့နယ်",
                "ဖောင်းပြင်မြို့နယ်",
                "အရာတော်မြို့နယ်",
                "ဘုတလင်မြို့နယ်",
                "ချောင်းဦးမြို့နယ်",
                "ကနီမြို့နယ်",
                "မုံရွာမြို့နယ်",
                "ပုလဲမြို့နယ်",
                "ဆားလင်းကြီးမြို့နယ်",
                "ဒီပဲယင်းမြို့နယ်",
                "ယင်းမာပင်မြို့နယ်",
                "မြောင်မြို့နယ်",
                "မြင်းမူမြို့နယ်",
                "စစ်ကိုင်းမြို့နယ်",
                "ကန့်ဘလူမြို့နယ်",
                "ခင်ဦးမြို့နယ်",
                "ကျွန်းလှမြို့နယ်",
                "ရွှေဘိုမြို့နယ်",
                "တန့်ဆည်မြို့နယ်",
                "ဝက်လက်မြို့နယ်",
                "ရေဦးမြို့နယ်",
                "တမူးမြို့နယ်"
            ],
            [
                "ထားဝယ်မြို့နယ်",
                "လောင်းလုံမြို့နယ်",
                "သရက်ချောင်းမြို့နယ်",
                "ရေဖြူမြို့နယ်",
                "ဘုတ်ပြင်းမြို့နယ်",
                "ကော့သောင်းမြို့နယ်",
                "ကျွန်းစုမြို့နယ်",
                "မြိတ်မြို့နယ်",
                "ပုလောမြို့နယ်",
                "တနင်္သာရီမြို့နယ်"
            ],
            [
                "ဗိုလ်တထောင်မြို့နယ်",
                "ဒဂုံမြို့သစ်ဆိပ်ကမ်းမြို့နယ်",
                "ဒဂုံမြို့သစ်အရှေ့ပိုင်းမြို့နယ်",
                "ဒဂုံမြို့သစ်မြောက်ပိုင်းမြို့နယ်",
                "မြောက်ဥက္ကလာပမြို့နယ်",
                "ပုဇွန်တောင်မြို့နယ်",
                "ဒဂုံမြို့သစ်တောင်ပိုင်းမြို့နယ်",
                "တောင်ဥက္ကလာပမြို့နယ်",
                "သင်္ဃန်းကျွန်းမြို့နယ်",
                "လှိုင်မြို့နယ်",
                "လှိုင်သာယာမြို့နယ်",
                "အင်းစိန်မြို့နယ်",
                "ကမာရွတ်မြို့နယ်",
                "မရမ်းကုန်းမြို့နယ်",
                "မင်္ဂလာဒုံမြို့နယ်",
                "ရွှေပြည်သာမြို့နယ်",
                "ရန်ကင်းမြို့နယ်",
                "ဒလမြို့နယ်",
                "ဒေါပုံမြို့နယ်",
                "မင်္ဂလာတောင်ညွန့်မြို့နယ်",
                "ဆိပ်ကြီးခနောင်တိုမြို့နယ်",
                "တာမွေမြို့နယ်",
                "သာကေတမြို့နယ်",
                "အလုံမြို့နယ်",
                "ဗဟန်းမြို့နယ်",
                "ဒဂုံမြို့နယ်",
                "ကျောက်တံတားမြို့နယ်",
                "ကြည့်မြင်တိုင်မြို့နယ်",
                "လမ်းမတော်မြို့နယ်",
                "လသာမြို့နယ်",
                "ပန်းဘဲတန်းမြို့နယ်",
                "စမ်းချောင်းမြို့နယ်",
                "ဆိပ်ကမ်းမြို့နယ်",
                "ကိုကိုးကျွန်းမြို့နယ်",
                "လှည်းကူးမြို့နယ်",
                "မှော်ဘီမြို့နယ်",
                "ထန်းတပင်မြို့နယ်",
                "ကော့မှူးမြို့နယ်",
                "ခရမ်းမြို့နယ်",
                "ကွမ်းခြံကုန်းမြို့နယ်",
                "ကျောက်တန်းမြို့နယ်",
                "တိုက်ကြီးမြို့နယ်",
                "သန်လျင်မြို့နယ်",
                "သုံးခွမြို့နယ်",
                "တွံတေးမြို့နယ်"
            ],
            [
                "လယ်ဝေးမြို့နယ်",
                "ပျဉ်းမနားမြို့နယ်",
                "တပ်ကုန်းမြို့နယ်",
                "ဥတ္တရသီရိမြို့နယ်",
                "ဒက္ခိဏသီရိမြို့နယ်",
                "ပုဗ္ဗသီရိမြို့နယ်",
                "ဇမ္ဗူသီရိမြို့နယ်",
                "ဇေယျာသီရိမြို့နယ်"
            ]
        ];

        var highlightHoveredRegion = function (region) {

            unHighlightHoveredRegion(region);

            var regionElement = $(region).children();
            var classAttributes = $(region).attr("class");

            if (classAttributes.includes("selected")) {
                $(region).attr("class", "regions selected hovered");
            }
            else {
                $(region).attr("class", "regions hovered");
            }

            $(regionElement).attr("fill", hoveredColor);
        }

        var unHighlightHoveredRegion = function (region) {

            var selectedRegions = map.find(".hovered");

            $.each(selectedRegions, function (key, element) {

                var selectedElement = $(element).children();
                var selectedAttributes = $(element).attr("class");

                var elementId = $(element).attr("id");
                var id = _.last(elementId.split('-')) - 1;

                if (selectedAttributes.includes("selected")) {

                    $(selectedElement).attr("fill", selectedColor);
                    $(element).attr("class", "regions selected");
                }
                else {
                    $(selectedElement).attr("fill", regionColor[id]);
                    $(element).attr("class", "regions");
                }
            });

        }

        var highlightSelectedRegion = function (region) {

            var selectedRegions = map.find(".selected");
            var regionElement = $(region).children();

            $.each(selectedRegions, function (key, element) {

                var selectedElement = $(element).children();

                var elementId = $(element).attr("id");
                var id = _.last(elementId.split('-')) - 1;

                $(selectedElement).attr("fill", regionColor[id]);
                $(element).attr("class", "regions");

            });

            $(region).attr("class", "regions selected");
            $(regionElement).attr("fill", selectedColor);
        }

        var applyZoom = function (element, scale) {
            $(element).attr('transform', 'scale(' + scale + ')');
        }

        var applyTransform = function (element, transX, transY) {
            $(element).attr('transform', 'translate(' + transX + ', ' + transY + ')');
        };

        var initDragDrop = function () {

            var mouseDown = false;
            var oldPageX, oldPageY;
            var self = svg;

            var box = document.querySelector('svg').viewBox.baseVal;

            var factor = box.height / $(svg).height();

            var region = $(self).find(".g-map").eq(0);

            self.isMoving = false;
            self.isMovingTimeout = false;

            self.transX = 0;
            self.transY = 0;

            var lastTouchCount;
            var touchX;
            var touchY;

            $(self).unbind();

            $(self).mousemove(function (e) {

                if (mouseDown) {

                    self.transX -= (oldPageX - e.pageX) * factor;
                    self.transY -= (oldPageY - e.pageY) * factor;

                    applyTransform(region, self.transX, self.transY);

                    oldPageX = e.pageX;
                    oldPageY = e.pageY;

                    self.isMoving = true;
                    isDragging = true;

                    if (self.isMovingTimeout) {
                        clearTimeout(self.isMovingTimeout);
                    }

                    $(label).hide();
                }

                return false;

            }).mousedown(function (e) {

                mouseDown = true;
                oldPageX = e.pageX;
                oldPageY = e.pageY;

                return false;

            }).mouseup(function () {

                mouseDown = false;

                clearTimeout(self.isMovingTimeout);

                self.isMovingTimeout = setTimeout(function () {
                    self.isMoving = false;
                    isDragging = false;

                }, 100);

                return false;

            }).mouseout(function () {

                if (mouseDown && self.isMoving && isDragging) {

                    clearTimeout(self.isMovingTimeout);

                    self.isMovingTimeout = setTimeout(function () {
                        mouseDown = false;
                        self.isMoving = false;
                        isDragging = false;
                    }, 100);

                    return false;
                }
            });

            $(self).bind('touchmove', function (e) {

                var touches = e.originalEvent.touches;

                var transformXOld;
                var transformYOld;

                var isCovering = false;

                $(label).hide();

                if (touches.length === 1) {

                    if (lastTouchCount === 1) {

                        if (!isCovering) {

                            $(cover).fadeIn();
                            clearTimeout(self.touchingTimeout);

                            isCovering = true;

                            self.touchingTimeout = setTimeout(function () {

                                $(cover).fadeOut();

                                lastTouchCount = 0;

                                clearTimeout(self.touchingTimeout);
                                isCovering = false;

                            }, 800);
                        }

                        self.isMoving = false;
                        isDragging = false;

                        return true;
                    }

                } else if (touches.length === 2) {

                    if (isCovering) {

                        $(cover).fadeOut();
                        isCovering = false;
                        clearTimeout(self.touchingTimeout);
                    }

                    if (lastTouchCount === 2) {

                        if (touchX === touches[0].pageX && touchY === touches[0].pageY) {
                            return;
                        }

                        transformXOld = self.transX;
                        transformYOld = self.transY;

                        self.transX -= (touchX - touches[0].pageX) * factor;
                        self.transY -= (touchY - touches[0].pageY) * factor;

                        applyTransform(region, self.transX, self.transY);

                        if (transformXOld !== self.transX || transformYOld !== self.transY) {
                            e.preventDefault();
                        }

                        self.isMoving = true;
                        isDragging = true;

                        if (self.isMovingTimeout) {
                            clearTimeout(self.isMovingTimeout);
                        }
                    }

                    touchX = touches[0].pageX;
                    touchY = touches[0].pageY;

                }

                lastTouchCount = touches.length;

            });

            $(self).bind('touchstart', function () {
                lastTouchCount = 0;
            });

            $(self).bind('touchend', function () {
                lastTouchCount = 0;

            });

            $(map).on('touchmove', function (e) {

                if (self.isMoving) {

                    var event = e.originalEvent;
                    var delta = event.wheelDelta || -event.detail;

                    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                    e.preventDefault();
                }

            });
        }

        var colorMapByData = function () {

            regionColor = [];

            $.each(mapRegions, function (key, region) {

                regionColor.push('');

                var elementId = $(region).attr("id");
                var id = _.last(elementId.split('-')) - 1;

                var dataItem = !_.isEmpty(data) && data.length > id ? data[id] : null;

                var color = dataItem != null ? dataItem.Color : options.DefaultColor;

                regionColor[id] = color;

                $(region).children().attr("fill", color);

            });
        }

        var colorMapItemByData = function (index, dataItem) {

            var region = $(mapRegions).eq(index);

            var color = dataItem != null ? dataItem.Color : options.DefaultColor;

            regionColor[index] = color;

            $(region).children().attr("fill", color);
        }

        var initMap = function (displayBack) {

            $(map).append('<a class="map-zoomin">+</a>');
            $(map).append('<a class="map-zoomout">−</a>');

            if (displayBack) {
                $(map).append('<a class="map-back">&#8635;</a>');
            }
            else {

                if (currentLevel == 0) {
                    $(map).append('<a class="map-back" style="display:none;">&#8635;</a>');
                }
                else {
                    $(map).append('<a class="map-back">&#8635;</a>');
                }
            }

            $(map).append('<div class="map-label" style="display: none;"></div>');
            $(map).append('<div class="map-blank" style="display: none;"><span class="map-blank-label">Use 2 Fingers to move the map.</span></div>');

            svg = $(map).find('svg').eq(0);

            origin.x = $(svg).offset().left;
            origin.y = $(svg).offset().top;

            origin.dx = Math.abs($(svg).parent().parent().offset().left - $(svg).offset().left);
            origin.dy = Math.abs($(svg).parent().parent().offset().top - $(svg).offset().top);

            cover = $(map).find('.map-blank').eq(0);

            initDragDrop();

            mapRegions = $(map).find(".regions");

            var zoomInButton = $(map).find(".map-zoomin").eq(0);
            var zoomOutButton = $(map).find(".map-zoomout").eq(0);

            backButton = $(map).find(".map-back").eq(0);
            label = $(map).find(".map-label").eq(0);

            var regions = $(svg).find("path");

            currentScale = options.Zoom;

            colorMapByData();

            $.each(regions, function (key, region) {
                applyZoom(region, currentScale);
            });

            $(mapRegions).unbind();

            $(mapRegions).click(function () {

                highlightSelectedRegion(this);

                var elementId = $(this).attr("id");
                var id = _.last(elementId.split('-'));

                var name = options.Culture == 'en' ? enNames[currentLevel][id - 1] : mmNames[currentLevel][id - 1];

                var dataItem = { id: id, elementId: elementId, name: name, item: !_.isEmpty(data) && data.length > id - 1 ? data[id - 1] : null };

                if (options.OnClick) options.OnClick(dataItem);
            });

            $(mapRegions).dblclick(function () {

                var elementId = $(this).attr("id");
                var id = _.last(elementId.split('-'));

                var name = options.Culture == 'en' ? enNames[currentLevel][id - 1] : mmNames[currentLevel][id - 1];

                var dataItem = { id: id, elementId: elementId, name: name, item: !_.isEmpty(data) && data.length > id - 1 ? data[id - 1] : null };

                if (options.OnDoubleClick) options.OnDoubleClick(dataItem);

                if (options.Drilldown && options.Drilldown == true) {

                    if (currentLevel == 0) {

                        currentLevel = id;

                        loadMap(true);
                    }
                }
                else {
                    if (currentLevel > 0) {
                        $(backButton).show();
                    }
                }
            });


            $(mapRegions).mousemove(function (e) {

                var left = e.pageX - $(label).width() - origin.x;
                var top = e.pageY - $(label).height() - origin.y + origin.dy;

                $(label).css({
                    left: left,
                    top: top
                });

            });

            $(mapRegions).mouseover(function (e) {

                highlightHoveredRegion(this);

                if (!isDragging) {

                    var elementId = $(this).attr("id");
                    var id = _.last(elementId.split('-'));

                    var name = options.Culture == 'en' ? enNames[currentLevel][id - 1] : mmNames[currentLevel][id - 1];

                    var dataItem = { id: id, elementId: elementId, name: name, item: !_.isEmpty(data) && data.length > id - 1 ? data[id - 1] : null };

                    if (options.ShowTooltip) {

                        var tooltipName = !_.isEmpty(data) && data.length > id - 1 && data[id - 1].Item != null ? name + ' - ' + data[id - 1].Item : name;

                        $(label).show();
                        $(label).html(tooltipName);
                    }

                    if (options.OnHover) options.OnHover(dataItem);
                }
            });


            $(mapRegions).mouseout(function (e) {

                unHighlightHoveredRegion(this);
                $(label).hide();

            });

            $(zoomInButton).unbind().bind("click", function () {

                var regions = $(svg).find("path");

                currentScale += 0.1;

                $.each(regions, function (key, region) {
                    applyZoom(region, currentScale);
                });

                $(label).hide();
            });

            $(zoomOutButton).unbind().bind("click", function () {

                var regions = $(svg).find("path");

                currentScale = currentScale < 1 ? 1 : currentScale -= 0.1;

                if (currentScale >= 1) {

                    $.each(regions, function (key, region) {
                        applyZoom(region, currentScale);
                    });
                }

                $(label).hide();
            });

            $(backButton).unbind().bind("click", function () {

                if (currentLevel > 0) {

                    currentLevel = 0;

                    if (options.Drilldown && options.Drilldown == true) {

                        loadMap(false);
                    }
                    else {

                        if (options.OnBack) options.OnBack(currentLevel);
                    }
                }

                $(label).hide();
            });
        }

        var loadMap = function (displayBack, callback) {

            map.load(options.MapPath + "/" + maps[currentLevel], function () {

                initMap(displayBack);

                if (options.OnLoad) options.OnLoad(mapRegions);
                if (callback) callback();

            });
        }

        if (options != null) {
            selectedColor = options.SelectedColor || selectedColor;
            hoveredColor = options.HoveredColor || hoveredColor;
            currentLevel = options.Level;

            data = options.Data;

            loadMap();
        }


        //Public Methods
        map.SetData = function (dataArray) {
            data = dataArray;

            loadMap(false, function () {
                colorMapByData();
            });

            return map;
        }

        map.SetDataItem = function (index, dataItem) {

            if (!_.isEmpty(data) && data.length > index) {

                loadMap(false, function () {

                    data[index] = dataItem;
                    colorMapItemByData(index, dataItem);
                });
            }

            return map;
        }

        map.GetData = function () {
            return data;
        }

        map.GetDataItem = function (index) {
            return !_.isEmpty(data) && data.length > index ? data[index] : null;
        }


        map.GetColor = function () {
            return regionColor;
        }

        map.GetColorItem = function (index) {
            return !_.isEmpty(regionColor) && regionColor.length > index ? regionColor[index] : null;
        }

        return map;

    };

}(jQuery));


